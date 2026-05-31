import { create } from 'zustand';

interface AudioState {
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  eqParams: {
    lowCut: number;
    lowShelf: number;
    bell1Freq: number;
    bell1Gain: number;
    bell1Q: number;
    bell2Freq: number;
    bell2Gain: number;
    bell2Q: number;
    highShelf: number;
    highCut: number;
  };
  presets: Array<{
    name: string;
    eqParams: AudioState['eqParams'];
  }>;
  setAudioBuffer: (buffer: AudioBuffer) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setEQParam: (param: keyof AudioState['eqParams'], value: number) => void;
  savePreset: (name: string) => void;
  loadPreset: (name: string) => void;
  deletePreset: (name: string) => void;
}

export const useAudioStore = create<AudioState>((set, get) => ({
  audioBuffer: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  eqParams: {
    lowCut: 0,
    lowShelf: 0,
    bell1Freq: 100,
    bell1Gain: 0,
    bell1Q: 1,
    bell2Freq: 1000,
    bell2Gain: 0,
    bell2Q: 1,
    highShelf: 0,
    highCut: 0,
  },
  presets: [],
  setAudioBuffer: (buffer) => set({ audioBuffer: buffer, duration: buffer.duration }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setEQParam: (param, value) =>
    set((state) => ({
      eqParams: { ...state.eqParams, [param]: value },
    })),
  savePreset: (name) =>
    set((state) => ({
      presets: [
        ...state.presets,
        { name, eqParams: { ...state.eqParams } },
      ],
    })),
  loadPreset: (name) =>
    set((state) => {
      const preset = state.presets.find((p) => p.name === name);
      return preset ? { eqParams: { ...preset.eqParams } } : state;
    }),
  deletePreset: (name) =>
    set((state) => ({
      presets: state.presets.filter((p) => p.name !== name),
    })),
}));
