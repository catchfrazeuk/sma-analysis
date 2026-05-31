import React, { useState, useEffect } from 'react';
import { useAudioStore } from './store/audioStore';
import Header from './components/Header';
import Waveform from './components/Waveform';
import EQSection from './components/EQSection';
import ControlsSection from './components/ControlsSection';
import PresetManager from './components/PresetManager';
import FileDropZone from './components/FileDropZone';
import SpectrumVisualizer from './components/SpectrumVisualizer';
import LoudnessMeter from './components/LoudnessMeter';
import ABComparison from './components/ABComparison';
import ExportDialog from './components/ExportDialog';
import './styles/App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'presets'>('analysis');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const { audioBuffer, initializeAudioEngine } = useAudioStore();

  useEffect(() => {
    initializeAudioEngine();
  }, [initializeAudioEngine]);

  return (
    <div className="sma-app">
      <Header />
      <div className="main-content">
        {!audioBuffer ? (
          <FileDropZone onFileLoaded={() => {}} />
        ) : (
          <>
            <Waveform />
            <div className="workspace">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                  onClick={() => setActiveTab('analysis')}
                >
                  ANALYSIS
                </button>
                <button
                  className={`tab ${activeTab === 'presets' ? 'active' : ''}`}
                  onClick={() => setActiveTab('presets')}
                >
                  PRESETS
                </button>
              </div>
              {activeTab === 'analysis' ? (
                <>
                  <SpectrumVisualizer />
                  <LoudnessMeter />
                  <EQSection />
                  <ABComparison />
                  <ControlsSection onExport={() => setIsExportDialogOpen(true)} />
                </>
              ) : (
                <PresetManager />
              )}
            </div>
          </>
        )}
      </div>
      <ExportDialog isOpen={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)} />
    </div>
  );
};

export default App;
