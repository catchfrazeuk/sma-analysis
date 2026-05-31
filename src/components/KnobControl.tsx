import React from 'react';
import '../styles/KnobControl.css';

interface KnobControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
}

const KnobControl: React.FC<KnobControlProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const rotation = (percentage / 100) * 270 - 135;

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const newValue = Math.max(min, Math.min(max, value + delta));
    onChange(newValue);
  };

  return (
    <div className="knob-control">
      <label>{label}</label>
      <div className="knob-container" onWheel={handleWheel}>
        <svg className="knob" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="knob-bg" />
          <circle cx="50" cy="50" r="40" className="knob-track" />
          <line
            x1="50"
            y1="15"
            x2="50"
            y2="25"
            className="knob-indicator"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: '50px 50px',
            }}
          />
        </svg>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="knob-slider"
      />
      <div className="knob-value">{value.toFixed(2)}</div>
    </div>
  );
};

export default KnobControl;
