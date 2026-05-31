export class SpectrumAnalyzer {
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private frequencyBands: FrequencyBand[] = [];

  constructor(analyser: AnalyserNode) {
    this.analyser = analyser;
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.initializeFrequencyBands();
  }

  private initializeFrequencyBands() {
    // Standard frequency bands for audio analysis
    const bandLabels = [
      { name: '20Hz', freq: 20 },
      { name: '50Hz', freq: 50 },
      { name: '100Hz', freq: 100 },
      { name: '250Hz', freq: 250 },
      { name: '500Hz', freq: 500 },
      { name: '1kHz', freq: 1000 },
      { name: '2kHz', freq: 2000 },
      { name: '4kHz', freq: 4000 },
      { name: '8kHz', freq: 8000 },
      { name: '16kHz', freq: 16000 },
    ];

    this.frequencyBands = bandLabels.map(band => ({
      name: band.name,
      frequency: band.freq,
      magnitude: 0,
    }));
  }

  getFrequencyData(): Uint8Array {
    this.analyser.getByteFrequencyData(this.dataArray);
    return new Uint8Array(this.dataArray);
  }

  getWaveformData(): Uint8Array {
    const waveData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteTimeDomainData(waveData);
    return waveData;
  }

  getFrequencyBands(): FrequencyBand[] {
    const frequencyData = this.getFrequencyData();
    const nyquist = 22050; // Standard sample rate / 2
    const binWidth = nyquist / frequencyData.length;

    return this.frequencyBands.map(band => {
      const binIndex = Math.round(band.frequency / binWidth);
      return {
        ...band,
        magnitude: frequencyData[Math.min(binIndex, frequencyData.length - 1)] / 255,
      };
    });
  }

  getRMSLevel(): number {
    const waveData = this.getWaveformData();
    let sum = 0;
    for (let i = 0; i < waveData.length; i++) {
      const normalized = (waveData[i] - 128) / 128;
      sum += normalized * normalized;
    }
    return Math.sqrt(sum / waveData.length);
  }

  getPeakFrequency(): number {
    const frequencyData = this.getFrequencyData();
    let maxValue = 0;
    let maxIndex = 0;

    for (let i = 0; i < frequencyData.length; i++) {
      if (frequencyData[i] > maxValue) {
        maxValue = frequencyData[i];
        maxIndex = i;
      }
    }

    const nyquist = 22050;
    const binWidth = nyquist / frequencyData.length;
    return maxIndex * binWidth;
  }

  getEnergyDistribution(): { low: number; mid: number; high: number } {
    const frequencyData = this.getFrequencyData();
    const length = frequencyData.length;

    let low = 0,
      mid = 0,
      high = 0;

    // Divide spectrum into three parts
    for (let i = 0; i < length; i++) {
      const value = frequencyData[i];
      if (i < length / 3) {
        low += value;
      } else if (i < (length * 2) / 3) {
        mid += value;
      } else {
        high += value;
      }
    }

    const total = low + mid + high || 1;
    return {
      low: low / total,
      mid: mid / total,
      high: high / total,
    };
  }
}

export interface FrequencyBand {
  name: string;
  frequency: number;
  magnitude: number;
}
