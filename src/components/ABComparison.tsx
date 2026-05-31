import React, { useState } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/ABComparison.css';

const ABComparison: React.FC = () => {
  const { applyEQToBuffer, originalBuffer } = useAudioStore();
  const [isComparingA, setIsComparingA] = useState(true);

  const handleToggleComparison = () => {
    setIsComparingA(!isComparingA);
    // This would swap between original and EQ'd versions
  };

  return (
    <div className="ab-comparison">
      <div className="comparison-controls">
        <button
          className={`comparison-btn ${isComparingA ? 'active' : ''}`}
          onClick={() => setIsComparingA(true)}
        >
          A - ORIGINAL
        </button>
        <div className="comparison-indicator">
          {isComparingA ? 'LISTENING TO A' : 'LISTENING TO B'}
        </div>
        <button
          className={`comparison-btn ${!isComparingA ? 'active' : ''}`}
          onClick={() => setIsComparingA(false)}
        >
          B - WITH EQ
        </button>
      </div>
      <button className="quick-swap-btn" onClick={handleToggleComparison}>
        ⇄ QUICK SWAP
      </button>
    </div>
  );
};

export default ABComparison;
