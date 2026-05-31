import React, { useState } from 'react';
import { useAudioStore } from './store/audioStore';
import Header from './components/Header';
import Waveform from './components/Waveform';
import EQSection from './components/EQSection';
import ControlsSection from './components/ControlsSection';
import PresetManager from './components/PresetManager';
import './styles/App.css';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analysis' | 'presets'>('analysis');
  const { audioBuffer } = useAudioStore();

  return (
    <div className="sma-app">
      <Header />
      <div className="main-content">
        {!audioBuffer ? (
          <div className="drop-zone">
            <div className="drop-zone-content">
              <svg className="drop-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <h2>DROP AUDIO FILES HERE</h2>
              <button className="browse-btn">BROWSE FILES</button>
            </div>
          </div>
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
                  <EQSection />
                  <ControlsSection />
                </>
              ) : (
                <PresetManager />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
