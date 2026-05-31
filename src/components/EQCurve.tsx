import React, { useEffect, useRef } from 'react';
import '../styles/EQCurve.css';

interface EQCurveProps {
  eqParams: {
    lowCut: number;
    lowShelf: number;
    bell1Freq: number;
    bell1Gain: number;
    bell1Q: number;
    bell2Freq: number;
    bell2Gain: number;
    bell2Q: number;
    highShelf: number;
    highCut: number;
  };
}

const EQCurve: React.FC<EQCurveProps> = ({ eqParams }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear with dark background
    ctx.fillStyle = '#1A1F3A';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#2A3050';
    ctx.lineWidth = 0.5;
    const gridSpacing = width / 10;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSpacing, 0);
      ctx.lineTo(i * gridSpacing, height);
      ctx.stroke();
    }

    // Draw curve
    ctx.strokeStyle = '#E91E63';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x++) {
      const freq = Math.pow(10, (x / width) * Math.log10(20000 / 20) + Math.log10(20));
      const gain = calculateGain(freq, eqParams);
      const y = height / 2 - (gain / 24) * (height / 2);

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw control points
    const freqs = [eqParams.bell1Freq, eqParams.bell2Freq];
    freqs.forEach((freq) => {
      const x = (Math.log10(freq / 20) / Math.log10(20000 / 20)) * width;
      const gain = calculateGainAtFreq(freq, eqParams);
      const y = height / 2 - (gain / 24) * (height / 2);

      ctx.fillStyle = '#FF4081';
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [eqParams]);

  const calculateGain = (freq: number, params: EQCurveProps['eqParams']) => {
    let gain = 0;
    // Simplified gain calculation - would be more complex in production
    if (freq < 100) gain += params.lowShelf;
    if (freq < 500) gain += params.bell1Gain * Math.exp(-Math.pow((Math.log(freq) - Math.log(params.bell1Freq)) / Math.log(params.bell1Q), 2) / 2);
    if (freq > 5000) gain += params.highShelf;
    return gain;
  };

  const calculateGainAtFreq = (freq: number, params: EQCurveProps['eqParams']) => {
    return calculateGain(freq, params);
  };

  return (
    <div className="eq-curve-wrapper">
      <canvas ref={canvasRef} width={800} height={300} className="eq-curve-canvas" />
    </div>
  );
};

export default EQCurve;
