import * as Tone from 'tone';

export class AudioEngine {
  private audioContext: AudioContext;
  private source: AudioBufferAudioNode | null = null;
  private analyser: AnalyserNode;
  private eqFilters: BiquadFilterNode[] = [];
  private gainNode: GainNode;
  private isPlaying = false;
  private startTime = 0;
  private pauseTime = 0;
  private currentBuffer: AudioBuffer | null = null;
  private onPlayheadUpdate: ((time: number) => void) | null = null;
  private animationId: number | null = null;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1;
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
    this.initializeEQFilters();
  }

  private initializeEQFilters() {
    // Create a chain of filters for EQ
    const filterFrequencies = [100, 250, 1000, 4000, 10000];
    let prevNode: AudioNode = this.audioContext.createGain();
    prevNode.connect(this.gainNode);

    this.eqFilters = filterFrequencies.map((freq) => {
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = freq;
      filter.gain.value = 0;
      filter.Q.value = 1;
      prevNode.connect(filter);
      prevNode = filter;
      return filter;
    });
  }

  async loadAudioFile(file: File): Promise<AudioBuffer> {
    const arrayBuffer = await file.arrayBuffer();
    this.currentBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return this.currentBuffer;
  }

  loadAudioBuffer(buffer: AudioBuffer): void {
    this.currentBuffer = buffer;
  }

  play(): void {
    if (this.isPlaying || !this.currentBuffer) return;

    if (this.source) {
      this.source.disconnect();
    }

    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.currentBuffer;
    this.source.connect(this.eqFilters[0]);

    const resumeTime = this.pauseTime;
    this.startTime = this.audioContext.currentTime - resumeTime;
    this.isPlaying = true;

    this.source.start(0, resumeTime);
    this.updatePlayhead();
  }

  pause(): void {
    if (!this.isPlaying || !this.source) return;

    this.isPlaying = false;
    this.pauseTime = this.audioContext.currentTime - this.startTime;
    this.source.stop();

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
  }

  stop(): void {
    this.pause();
    this.pauseTime = 0;
  }

  setCurrentTime(time: number): void {
    const wasPlaying = this.isPlaying;
    if (wasPlaying) this.pause();
    this.pauseTime = time;
    if (wasPlaying) this.play();
  }

  private updatePlayhead() {
    const currentTime = this.audioContext.currentTime - this.startTime;
    if (this.onPlayheadUpdate) {
      this.onPlayheadUpdate(Math.min(currentTime, this.currentBuffer?.duration || 0));
    }

    if (this.isPlaying) {
      this.animationId = requestAnimationFrame(() => this.updatePlayhead());
    }
  }

  onPlayheadChange(callback: (time: number) => void): void {
    this.onPlayheadUpdate = callback;
  }

  setEQParameter(filterIndex: number, param: string, value: number): void {
    if (filterIndex < 0 || filterIndex >= this.eqFilters.length) return;
    const filter = this.eqFilters[filterIndex];

    switch (param) {
      case 'frequency':
        filter.frequency.value = value;
        break;
      case 'gain':
        filter.gain.value = value;
        break;
      case 'q':
        filter.Q.value = value;
        break;
    }
  }

  getFrequencyData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getWaveformData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  calculateLUFS(): number {
    // Simplified LUFS calculation
    const frequencyData = this.getFrequencyData();
    let sum = 0;
    for (let i = 0; i < frequencyData.length; i++) {
      sum += Math.pow(frequencyData[i] / 255, 2);
    }
    const rms = Math.sqrt(sum / frequencyData.length);
    const lufs = -0.691 + 10 * Math.log10(Math.max(rms, 0.001));
    return lufs;
  }

  getPeakLevel(): number {
    const frequencyData = this.getFrequencyData();
    return Math.max(...frequencyData) / 255;
  }

  async exportAudio(filename: string): Promise<void> {
    if (!this.currentBuffer) return;

    const offlineContext = new OfflineAudioContext(
      this.currentBuffer.numberOfChannels,
      this.currentBuffer.length,
      this.currentBuffer.sampleRate
    );

    const offlineSource = offlineContext.createBufferSource();
    offlineSource.buffer = this.currentBuffer;
    offlineSource.connect(offlineContext.destination);
    offlineSource.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    this.downloadAudio(renderedBuffer, filename);
  }

  private downloadAudio(buffer: AudioBuffer, filename: string): void {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 'audio/wav';
    const type = 'audio/wav';

    const offlineContext = new OfflineAudioContext(numberOfChannels, buffer.length, sampleRate);
    const source = offlineContext.createBufferSource();
    source.buffer = buffer;
    source.connect(offlineContext.destination);
    source.start(0);

    offlineContext.startRendering().then((renderedBuffer) => {
      const wav = this.encodeWAV(renderedBuffer);
      const blob = new Blob([wav], { type: format });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'audio.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  private encodeWAV(audioBuffer: AudioBuffer): ArrayBuffer {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const kbps = (sampleRate * numberOfChannels * bitDepth) / 8;

    const interleaved = this.interleave(audioBuffer);
    const dataLength = interleaved.length * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataLength);
    const view = new DataView(buffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, kbps, true);
    view.setUint16(32, numberOfChannels * bytesPerSample, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    const volume = 0.8;
    for (let i = 0; i < interleaved.length; i++) {
      view.setInt16(offset, interleaved[i] * (0x7fff * volume), true);
      offset += 2;
    }

    return buffer;
  }

  private interleave(audioBuffer: AudioBuffer): Float32Array {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels;
    const interleaved = new Float32Array(length);

    let index = 0;
    for (let i = 0; i < audioBuffer.length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        interleaved[index++] = audioBuffer.getChannelData(channel)[i];
      }
    }

    return interleaved;
  }

  get isAudioPlaying(): boolean {
    return this.isPlaying;
  }

  get sampleRate(): number {
    return this.audioContext.sampleRate;
  }
}
