import React, { useState } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/PresetManager.css';

const PresetManager: React.FC = () => {
  const { presets, savePreset, loadPreset, deletePreset } = useAudioStore();
  const [presetName, setPresetName] = useState('');

  const handleSave = () => {
    if (presetName.trim()) {
      savePreset(presetName);
      setPresetName('');
    }
  };

  return (
    <section className="preset-manager">
      <div className="preset-save">
        <input
          type="text"
          placeholder="Preset name"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          className="preset-input"
        />
        <button onClick={handleSave} className="preset-btn primary">
          SAVE PRESET
        </button>
      </div>
      <div className="preset-list">
        {presets.length === 0 ? (
          <p className="no-presets">No presets saved yet</p>
        ) : (
          presets.map((preset) => (
            <div key={preset.name} className="preset-item">
              <span className="preset-name">{preset.name}</span>
              <div className="preset-actions">
                <button
                  onClick={() => loadPreset(preset.name)}
                  className="preset-btn"
                >
                  LOAD
                </button>
                <button
                  onClick={() => deletePreset(preset.name)}
                  className="preset-btn delete"
                >
                  DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PresetManager;
