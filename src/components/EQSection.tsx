import React from 'react';
import { useAudioStore } from '../store/audioStore';
import EQCurve from './EQCurve';
import KnobControl from './KnobControl';
import '../styles/EQSection.css';

const EQSection: React.FC = () => {
  const { eqParams, setEQParam } = useAudioStore();

  const eqControls = [
    { name: 'LOW CUT', param: 'lowCut', min: -12, max: 12 },
    { name: 'LOW SHELF', param: 'lowShelf', min: -12, max: 12 },
    { name: 'BELL FREQ', param: 'bell1Freq', min: 20, max: 20000, isLog: true },
    { name: 'BELL GAIN', param: 'bell1Gain', min: -12, max: 12 },
    { name: 'BELL Q', param: 'bell1Q', min: 0.1, max: 10 },
    { name: 'HIGH SHELF', param: 'highShelf', min: -12, max: 12 },
    { name: 'HIGH CUT', param: 'highCut', min: -12, max: 12 },
  ];

  return (
    <section className="eq-section">
      <div className="eq-curve-container">
        <EQCurve eqParams={eqParams} />
      </div>
      <div className="knobs-grid">
        {eqControls.map((control) => (
          <KnobControl
            key={control.param}
            label={control.name}
            value={eqParams[control.param as keyof typeof eqParams]}
            onChange={(value) =>
              setEQParam(control.param as keyof typeof eqParams, value)
            }
            min={control.min}
            max={control.max}
          />
        ))}
      </div>
    </section>
  );
};

export default EQSection;
