import React, { useEffect, useState } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/LoudnessMeter.css';

interface LoudnessMetrics {
  integrated: number;
  shortTerm: number;
  momentary: number;
  truePeak: number;
  loudnessRange: number;
}

const LoudnessMeter: React.FC = () => {
  const { loudnessMetrics } = useAudioStore();
  const [displayMetrics, setDisplayMetrics] = useState<LoudnessMetrics>({
    integrated: -100,
    shortTerm: -100,
    momentary: -100,
    truePeak: -Infinity,
    loudnessRange: 0,
  });

  useEffect(() => {
    if (loudnessMetrics) {
      setDisplayMetrics(loudnessMetrics);
    }
  }, [loudnessMetrics]);

  const getMeterColor = (lufs: number): string => {
    if (lufs > -6) return '#FF0000'; // Red - too loud
    if (lufs > -9) return '#FFA500'; // Orange - slightly loud
    if (lufs > -14) return '#00FF00'; // Green - ideal
    if (lufs > -18) return '#00FFFF'; // Cyan - slightly quiet
    return '#0000FF'; // Blue - too quiet
  };

  const renderMeterBar = (value: number, range: [number, number], label: string) => {
    const [min, max] = range;
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
    const color = getMeterColor(value);

    return (
      <div key={label} className="meter-item">
        <label>{label}</label>
        <div className="meter-bar-container">
          <div
            className="meter-bar-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: color,
            }}
          />
        </div>
        <span className="meter-value">{value.toFixed(2)} LUFS</span>
      </div>
    );
  };

  return (
    <div className="loudness-meter">
      <h3>LOUDNESS ANALYSIS</h3>
      <div className="meters-container">
        {renderMeterBar(displayMetrics.integrated, [-30, 0], 'Integrated')}
        {renderMeterBar(displayMetrics.shortTerm, [-30, 0], 'Short Term')}
        {renderMeterBar(displayMetrics.momentary, [-30, 0], 'Momentary')}
      </div>
      <div className="metrics-display">
        <div className="metric">
          <span>True Peak:</span>
          <strong>{displayMetrics.truePeak.toFixed(2)} dBFS</strong>
        </div>
        <div className="metric">
          <span>Loudness Range:</span>
          <strong>{displayMetrics.loudnessRange.toFixed(2)} LU</strong>
        </div>
      </div>
    </div>
  );
};

export default LoudnessMeter;
