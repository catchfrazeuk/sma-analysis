import React from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/Header.css';

const Header: React.FC = () => {
  const { isPlaying, setPlaying, currentTime, duration } = useAudioStore();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sma-header">
      <div className="header-left">
        <div className="logo">
          <span className="logo-text">SMA</span>
          <span className="logo-triangle">▲</span>
        </div>
        <h1>ANALYSIS</h1>
      </div>
      <div className="header-center">
        <button
          className={`play-btn ${isPlaying ? 'playing' : ''}`}
          onClick={() => setPlaying(!isPlaying)}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <span className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>
      <div className="header-right">
        <button className="header-btn">⚙</button>
        <button className="header-btn">?</button>
      </div>
    </header>
  );
};

export default Header;
