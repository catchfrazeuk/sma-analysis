export class AudioAnalyzer {
  private audioBuffer: AudioBuffer | null = null;

  setAudioBuffer(buffer: AudioBuffer): void {
    this.audioBuffer = buffer;
  }

  /**
   * Calculate integrated loudness in LUFS (Loudness Units relative to Full Scale)
   */
  calculateIntegratedLoudness(): number {
    if (!this.audioBuffer) return 0;

    const channelData = this.audioBuffer.getChannelData(0);
    let sum = 0;
    let count = 0;

    // Use block-based loudness calculation
    const blockSize = Math.floor(this.audioBuffer.sampleRate * 0.4); // 400ms blocks

    for (let i = 0; i < channelData.length; i += blockSize) {
      const blockEnd = Math.min(i + blockSize, channelData.length);
      let blockSum = 0;

      for (let j = i; j < blockEnd; j++) {
        blockSum += Math.pow(channelData[j], 2);
      }

      const blockRMS = Math.sqrt(blockSum / (blockEnd - i));
      const blockLoudness = -0.691 + 10 * Math.log10(Math.max(blockRMS, 1e-10));

      if (blockLoudness > -70) {
        sum += blockLoudness;
        count++;
      }
    }

    return count > 0 ? sum / count : -100;
  }

  /**
   * Calculate true peak level in dBFS
   */
  calculateTruePeak(): number {
    if (!this.audioBuffer) return -Infinity;

    let max = 0;
    for (let c = 0; c < this.audioBuffer.numberOfChannels; c++) {
      const channel = this.audioBuffer.getChannelData(c);
      for (let i = 0; i < channel.length; i++) {
        max = Math.max(max, Math.abs(channel[i]));
      }
    }

    return 20 * Math.log10(Math.max(max, 1e-10));
  }

  /**
   * Calculate loudness range (LU)
   */
  calculateLoudnessRange(): number {
    if (!this.audioBuffer) return 0;

    const blockSize = Math.floor(this.audioBuffer.sampleRate * 0.4); // 400ms blocks
    const loudnesses: number[] = [];
    const channelData = this.audioBuffer.getChannelData(0);

    for (let i = 0; i < channelData.length; i += blockSize) {
      const blockEnd = Math.min(i + blockSize, channelData.length);
      let blockSum = 0;

      for (let j = i; j < blockEnd; j++) {
        blockSum += Math.pow(channelData[j], 2);
      }

      const blockRMS = Math.sqrt(blockSum / (blockEnd - i));
      const blockLoudness = -0.691 + 10 * Math.log10(Math.max(blockRMS, 1e-10));

      if (blockLoudness > -70) {
        loudnesses.push(blockLoudness);
      }
    }

    if (loudnesses.length === 0) return 0;

    loudnesses.sort((a, b) => a - b);
    const low = loudnesses[Math.floor(loudnesses.length * 0.1)];
    const high = loudnesses[Math.floor(loudnesses.length * 0.9)];

    return high - low;
  }

  /**
   * Get spectral centroid (frequency of center of mass)
   */
  calculateSpectralCentroid(): number {
    if (!this.audioBuffer) return 0;

    const channelData = this.audioBuffer.getChannelData(0);
    const fft = this.performFFT(channelData);
    const sampleRate = this.audioBuffer.sampleRate;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < fft.length; i++) {
      const frequency = (i * sampleRate) / (fft.length * 2);
      const magnitude = Math.abs(fft[i]);

      numerator += frequency * magnitude;
      denominator += magnitude;
    }

    return denominator > 0 ? numerator / denominator : 0;
  }

  /**
   * Get dynamic range (crest factor)
   */
  calculateDynamicRange(): number {
    if (!this.audioBuffer) return 0;

    let rms = 0;
    let peak = 0;

    for (let c = 0; c < this.audioBuffer.numberOfChannels; c++) {
      const channel = this.audioBuffer.getChannelData(c);
      let sum = 0;

      for (let i = 0; i < channel.length; i++) {
        const sample = Math.abs(channel[i]);
        sum += sample * sample;
        peak = Math.max(peak, sample);
      }

      rms = Math.sqrt(sum / channel.length);
    }

    return rms > 0 ? 20 * Math.log10(peak / rms) : 0;
  }

  /**
   * Simple FFT implementation using recursive Cooley-Tukey algorithm
   */
  private performFFT(samples: Float32Array, size: number = 512): Complex[] {
    const fft = samples.slice(0, size).map(s => ({ real: s, imag: 0 }));
    return this.fft(fft);
  }

  private fft(input: Complex[]): Complex[] {
    const N = input.length;

    if (N <= 1) return input;

    const even = input.filter((_, i) => i % 2 === 0);
    const odd = input.filter((_, i) => i % 2 === 1);

    const evenFFT = this.fft(even);
    const oddFFT = this.fft(odd);

    const result: Complex[] = [];

    for (let k = 0; k < N / 2; k++) {
      const angle = (-2 * Math.PI * k) / N;
      const wk = {
        real: Math.cos(angle),
        imag: Math.sin(angle),
      };

      const oddPart = this.complexMultiply(wk, oddFFT[k]);
      result[k] = this.complexAdd(evenFFT[k], oddPart);
      result[k + N / 2] = this.complexSubtract(evenFFT[k], oddPart);
    }

    return result;
  }

  private complexAdd(a: Complex, b: Complex): Complex {
    return { real: a.real + b.real, imag: a.imag + b.imag };
  }

  private complexSubtract(a: Complex, b: Complex): Complex {
    return { real: a.real - b.real, imag: a.imag - b.imag };
  }

  private complexMultiply(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real,
    };
  }
}

interface Complex {
  real: number;
  imag: number;
}
