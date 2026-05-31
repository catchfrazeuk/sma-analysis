import React from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/ControlsSection.css';

interface ControlsSectionProps {
  onExport: () => void;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({ onExport }) => {
  const { setPlaying, isPlaying, stop } = useAudioStore();

  return (
    <section className="controls-section">
      <button className="control-btn primary" onClick={() => setPlaying(!isPlaying)}>
        {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
      </button>
      <button className="control-btn" onClick={() => stop()}>
        ■ STOP
      </button>
      <button className="control-btn">↺ RESET</button>
      <button className="control-btn">A↔B COMPARE</button>
      <button className="control-btn export" onClick={onExport}>
        ↓ EXPORT
      </button>
    </section>
  );
};

export default ControlsSection;
