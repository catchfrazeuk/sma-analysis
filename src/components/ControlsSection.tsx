import React from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/ControlsSection.css';

const ControlsSection: React.FC = () => {
  const { setPlaying, isPlaying } = useAudioStore();

  return (
    <section className="controls-section">
      <button className="control-btn primary" onClick={() => setPlaying(!isPlaying)}>
        {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
      </button>
      <button className="control-btn">RESET</button>
      <button className="control-btn">COMPARE EQ</button>
    </section>
  );
};

export default ControlsSection;
