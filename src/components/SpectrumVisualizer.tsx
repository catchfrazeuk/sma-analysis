import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/SpectrumVisualizer.css';

const SpectrumVisualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { spectrumData } = useAudioStore();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#0A0E27';
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

    if (!spectrumData || spectrumData.length === 0) return;

    // Draw spectrum bars
    const barWidth = width / spectrumData.length;
    ctx.fillStyle = '#FF4081';

    for (let i = 0; i < spectrumData.length; i++) {
      const magnitude = spectrumData[i] / 255;
      const barHeight = magnitude * height;
      const x = i * barWidth;
      const y = height - barHeight;

      ctx.fillRect(x, y, barWidth - 1, barHeight);
    }

    // Draw frequency labels
    ctx.fillStyle = '#B0B8C8';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const labels = ['20Hz', '100Hz', '1kHz', '10kHz', '20kHz'];
    for (let i = 0; i < labels.length; i++) {
      const x = (i / (labels.length - 1)) * width;
      ctx.fillText(labels[i], x, height + 15);
    }
  }, [spectrumData]);

  return (
    <div className="spectrum-visualizer">
      <h3>SPECTRUM ANALYZER</h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={200}
        className="spectrum-canvas"
      />
    </div>
  );
};

export default SpectrumVisualizer;
