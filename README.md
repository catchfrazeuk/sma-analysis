# SMA Analysis

Professional Audio Analysis Tool for Windows & Mac - Similar to Mastering The Mix Expose 2

## Features

- 🎵 **Waveform Visualization** - Real-time audio waveform display with playhead
- 🎚️ **Advanced EQ** - Interactive EQ curve with multiple filter types
- 🎛️ **Knob Controls** - Precision controls for all EQ parameters
- 📊 **Loudness Analysis** - Measure and compare loudness levels
- 💾 **Preset Management** - Save and load EQ presets
- 🎯 **Audio File Support** - Drag & drop audio file loading
- 🖥️ **Cross-Platform** - Native Windows & Mac standalone apps

## Tech Stack

- **Frontend:** React 18 + TypeScript
- **Desktop:** Electron
- **State:** Zustand
- **Audio Processing:** Web Audio API + Tone.js
- **Styling:** CSS with design variables

## Color Palette

- Primary Pink: `#E91E63`
- Accent Pink: `#FF4081`
- Dark Background: `#0A0E27`
- Secondary Dark: `#1A1F3A`
- Grid/Border: `#2A3050`
- Text: `#FFFFFF`

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/catchfrazeuk/sma-analysis.git
cd sma-analysis

# Install dependencies
npm install
```

### Development

```bash
# Start Electron app with hot reload
npm run electron-dev

# Or start React development server only
npm run react-start
```

### Build

```bash
# Build for both Windows and Mac
npm run build

# Build for Windows only
npm run build-win

# Build for Mac only
npm run build-mac
```

## Project Structure

```
sma-analysis/
├── public/
│   ├── electron.js          # Main Electron process
│   ├── preload.js           # IPC bridge
│   └── index.html           # HTML template
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Waveform.tsx
│   │   ├── EQSection.tsx
│   │   ├── EQCurve.tsx
│   │   ├── KnobControl.tsx
│   │   ├── ControlsSection.tsx
│   │   └── PresetManager.tsx
│   ├── store/
│   │   └── audioStore.ts    # Zustand state management
│   ├── styles/              # CSS files
│   ├── App.tsx              # Main app component
│   └── index.tsx            # Entry point
├── package.json
└── README.md
```

## Component Overview

### Header
Displays app branding, playback controls, and time display.

### Waveform
Canva-based waveform visualization with real-time playhead.

### EQSection
Contains EQ curve visualization and knob controls for EQ parameters.

### EQCurve
Interactive frequency response curve showing current EQ settings.

### KnobControl
Rotary knob UI component with range slider fallback.

### ControlsSection
Playback and comparison controls.

### PresetManager
Save, load, and delete EQ presets.

## Audio Processing

The app uses Web Audio API for audio processing and analysis. Key parameters:

- **Low Cut/High Cut:** High-pass and low-pass filters
- **Low Shelf/High Shelf:** Shelving filters for bass/treble
- **Bell Filters:** Parametric EQ with frequency, gain, and Q control

## Next Steps

- [ ] Implement full Web Audio API integration for audio playback
- [ ] Add spectrum analyzer
- [ ] Implement loudness comparison (LUFS)
- [ ] Add more filter types
- [ ] Implement file export with EQ applied
- [ ] Add A/B comparison functionality
- [ ] Create installers for distribution
- [ ] Add user settings/preferences panel

## License

MIT

## Author

SMA Audio Tools
