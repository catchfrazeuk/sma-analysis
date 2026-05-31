# SMA Analysis - Build Instructions

## Prerequisites

- Node.js 16+ (https://nodejs.org)
- npm or yarn
- Xcode Command Line Tools (for macOS builds)

## Setup

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start Electron app with React hot reload
npm run electron-dev
```

This will:
1. Start the React development server on http://localhost:3000
2. Launch the Electron app automatically
3. Enable React DevTools in the browser

## Building for macOS

### Option 1: Build .dmg file (for distribution)

```bash
npm run build-mac-dmg
```

This will create:
- `dist/SMA Analysis.dmg` - Installer file
- `dist/SMA Analysis.zip` - Portable archive

### Option 2: Build Windows installer

```bash
npm run build-win
```

This will create:
- `dist/SMA Analysis Setup.exe` - NSIS installer
- `dist/SMA Analysis.exe` - Portable executable

## Installing on macOS

1. After building, locate the `.dmg` file in the `dist` folder
2. Double-click the `.dmg` file to open the installer
3. Drag the SMA Analysis app to the Applications folder
4. Launch from Applications folder

## Troubleshooting

### macOS Security Warning

If you see "unidentified developer" warning:
1. Right-click the app
2. Select "Open"
3. Click "Open" in the security dialog

Or bypass via Terminal:
```bash
xattr -d com.apple.quarantine /Applications/SMA\ Analysis.app
```

### Missing Native Dependencies

```bash
npm install --save-dev electron-rebuild
npx electron-rebuild
```

## Project Structure

```
sma-analysis/
├── public/
│   ├── electron.js       # Electron main process
│   ├── preload.js        # IPC bridge
│   └── index.html        # HTML template
├── src/
│   ├── components/       # React components
│   ├── services/         # Audio processing services
│   ├── store/            # Zustand state management
│   ├── styles/           # CSS files
│   ├── App.tsx           # Main app component
│   └── index.tsx         # Entry point
├── assets/               # App icons and resources
├── dist/                 # Built apps (created after build)
├── build/                # React build (created after build)
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## Features Implemented

✅ Web Audio API Integration
✅ Audio File Loading (Drag & Drop + File Browser)
✅ Waveform Visualization
✅ Real-time Spectrum Analyzer
✅ LUFS Loudness Metering
✅ Advanced EQ Controls (3 parametric bells + shelving)
✅ A/B Comparison (Original vs Processed)
✅ Preset Management (Save/Load/Delete)
✅ Audio Export (WAV format)
✅ Professional UI with SMA Branding
✅ Cross-platform (Windows & macOS)

## Audio Analysis Capabilities

- **Integrated Loudness**: Overall LUFS measurement
- **Short-Term Loudness**: Recent audio loudness
- **Momentary Loudness**: Real-time loudness
- **True Peak**: Maximum sample level in dBFS
- **Loudness Range**: Dynamic range in LU
- **Spectrum Analysis**: 10-band frequency visualization
- **RMS Level**: Root Mean Square measurement
- **Peak Frequency**: Dominant frequency detection

## EQ Controls

- Low Cut (High-pass filter)
- Low Shelf (Bass boost/cut)
- Bell Filter 1 (Parametric EQ - frequency, gain, Q)
- Bell Filter 2 (Parametric EQ - frequency, gain, Q)
- Bell Filter 3 (Parametric EQ - frequency, gain, Q)
- High Shelf (Treble boost/cut)
- High Cut (Low-pass filter)

## Keyboard Shortcuts

- **Cmd/Ctrl + O**: Open audio file
- **Cmd/Ctrl + E**: Export audio
- **Space**: Play/Pause
- **Cmd/Ctrl + Q**: Quit application

## Performance Notes

- Spectrum analysis runs at 50ms intervals
- Waveform visualization is canvas-based for performance
- Loudness calculation uses block-based approach (400ms blocks)
- All audio processing is real-time capable

## Known Limitations

- MP3 export requires external encoder (WAV recommended)
- Some macOS versions may require code signing for distribution
- Audio context may require user interaction to start

## Next Steps

- [ ] Add code signing for production macOS release
- [ ] Implement background audio processing
- [ ] Add more audio file format support
- [ ] Create custom installer branding
- [ ] Add crash reporting
- [ ] Implement analytics

## Support

For issues or feature requests, please check the GitHub issues page.
