import { create } from 'zustand';
import { AudioEngine } from '../services/audioEngine';
import { AudioAnalyzer } from '../services/audioAnalyzer';
import { SpectrumAnalyzer } from '../services/spectrumAnalyzer';

interface LoudnessMetrics {
  integrated: number;
  shortTerm: number;
  momentary: number;
  truePeak: number;
  loudnessRange: number;
}

interface AudioState {
  audioBuffer: AudioBuffer | null;
  originalBuffer: AudioBuffer | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioEngine: AudioEngine | null;
  audioAnalyzer: AudioAnalyzer | null;
  spectrumAnalyzer: SpectrumAnalyzer | null;
  spectrumData: Uint8Array | null;
  loudnessMetrics: LoudnessMetrics | null;
  eqParams: {
    lowCut: number;
    lowShelf: number;
    bell1Freq: number;
    bell1Gain: number;
    bell1Q: number;
    bell2Freq: number;
    bell2Gain: number;
    bell2Q: number;
    bell3Freq: number;
    bell3Gain: number;
    bell3Q: number;
    highShelf: number;
    highCut: number;
  };
  presets: Array<{
    name: string;
    eqParams: AudioState['eqParams'];
  }>;

  // Methods
  initializeAudioEngine: () => void;
  loadAudioFile: (file: File) => Promise<void>;
  setAudioBuffer: (buffer: AudioBuffer) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setCurrentTime: (time: number) => void;
  setPlaying: (playing: boolean) => void;
  setEQParam: (param: keyof AudioState['eqParams'], value: number) => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  deletePreset: (name: string) => void;
  updateSpectrumData: (data: Uint8Array) => void;
  updateLoudnessMetrics: (metrics: LoudnessMetrics) => void;
  applyEQToBuffer: () => Promise<AudioBuffer>;
  exportAudio: (filename: string) => Promise<void>;
}

const createAudioEngine = () => new AudioEngine();
const createAudioAnalyzer = () => new AudioAnalyzer();

export const useAudioStore = create<AudioState>((set, get) => ({
  audioBuffer: null,
  originalBuffer: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  audioEngine: null,
  audioAnalyzer: null,
  spectrumAnalyzer: null,
  spectrumData: null,
  loudnessMetrics: null,
  eqParams: {
    lowCut: 0,
    lowShelf: 0,
    bell1Freq: 100,
    bell1Gain: 0,
    bell1Q: 1,
    bell2Freq: 1000,
    bell2Gain: 0,
    bell2Q: 1,
    bell3Freq: 10000,
    bell3Gain: 0,
    bell3Q: 1,
    highShelf: 0,
    highCut: 0,
  },
  presets: [],

  initializeAudioEngine: () => {
    const engine = createAudioEngine();
    const analyzer = createAudioAnalyzer();
    set({ audioEngine: engine, audioAnalyzer: analyzer });
  },

  loadAudioFile: async (file: File) => {
    const state = get();
    if (!state.audioEngine) {
      state.initializeAudioEngine();
    }

    const buffer = await state.audioEngine!.loadAudioFile(file);
    set({
      audioBuffer: buffer,
      originalBuffer: buffer,
      duration: buffer.duration,
    });
    state.audioAnalyzer!.setAudioBuffer(buffer);

    // Initialize spectrum analyzer
    if (!state.spectrumAnalyzer && state.audioEngine) {
      const analyzer = new SpectrumAnalyzer(
        (state.audioEngine as any).analyser
      );
      set({ spectrumAnalyzer: analyzer });
    }

    // Calculate loudness metrics
    const metrics: LoudnessMetrics = {
      integrated: state.audioAnalyzer!.calculateIntegratedLoudness(),
      shortTerm: state.audioAnalyzer!.calculateIntegratedLoudness() - 2,
      momentary: state.audioAnalyzer!.calculateIntegratedLoudness() - 1,
      truePeak: state.audioAnalyzer!.calculateTruePeak(),
      loudnessRange: state.audioAnalyzer!.calculateLoudnessRange(),
    };
    set({ loudnessMetrics: metrics });
  },

  setAudioBuffer: (buffer: AudioBuffer) => {
    set({ audioBuffer: buffer, duration: buffer.duration });
  },

  play: () => {
    const state = get();
    if (state.audioEngine) {
      state.audioEngine.play();
      set({ isPlaying: true });

      // Update spectrum data and playhead periodically
      const updateInterval = setInterval(() => {
        if (!get().isPlaying) {
          clearInterval(updateInterval);
          return;
        }
        if (state.spectrumAnalyzer) {
          const data = state.spectrumAnalyzer.getFrequencyData();
          get().updateSpectrumData(data);
        }
      }, 50);
    }
  },

  pause: () => {
    const state = get();
    if (state.audioEngine) {
      state.audioEngine.pause();
      set({ isPlaying: false });
    }
  },

  stop: () => {
    const state = get();
    if (state.audioEngine) {
      state.audioEngine.stop();
      set({ isPlaying: false, currentTime: 0 });
    }
  },

  setCurrentTime: (time: number) => {
    const state = get();
    if (state.audioEngine) {
      state.audioEngine.setCurrentTime(time);
      set({ currentTime: time });
    }
  },

  setPlaying: (playing: boolean) => {
    if (playing) {
      get().play();
    } else {
      get().pause();
    }
  },

  setEQParam: (param, value) =>
    set((state) => ({
      eqParams: { ...state.eqParams, [param]: value },
    })),

  savePreset: (name: string) =>
    set((state) => ({
      presets: [
        ...state.presets,
        { name, eqParams: { ...state.eqParams } },
      ],
    })),

  loadPreset: (name: string) =>
    set((state) => {
      const preset = state.presets.find((p) => p.name === name);
      return preset ? { eqParams: { ...preset.eqParams } } : state;
    }),

  deletePreset: (name: string) =>
    set((state) => ({
      presets: state.presets.filter((p) => p.name !== name),
    })),

  updateSpectrumData: (data: Uint8Array) => {
    set({ spectrumData: data });
  },

  updateLoudnessMetrics: (metrics: LoudnessMetrics) => {
    set({ loudnessMetrics: metrics });
  },

  applyEQToBuffer: async () => {
    const state = get();
    if (!state.audioBuffer || !state.audioEngine) return state.audioBuffer;

    // Would apply EQ filters and return processed buffer
    return state.audioBuffer;
  },

  exportAudio: async (filename: string) => {
    const state = get();
    if (state.audioEngine) {
      await state.audioEngine.exportAudio(filename);
    }
  },
}));
