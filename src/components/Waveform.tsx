import React, { useEffect, useRef } from 'react';
import { useAudioStore } from '../store/audioStore';
import '../styles/Waveform.css';

const Waveform: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { audioBuffer, currentTime } = useAudioStore();

  useEffect(() => {
    if (!canvasRef.current || !audioBuffer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);

    // Clear canvas with dark background
    ctx.fillStyle = '#0A0E27';
    ctx.fillRect(0, 0, width, height);

    // Draw waveform
    ctx.strokeStyle = '#FF4081';
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;

      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const y = (1 + min) * (height / 2);
      if (i === 0) ctx.moveTo(i, y);
      else ctx.lineTo(i, y);
    }

    ctx.stroke();

    // Draw playhead
    const playheadX = (currentTime / audioBuffer.duration) * width;
    ctx.strokeStyle = '#E91E63';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  }, [audioBuffer, currentTime]);

  return (
    <div className="waveform-container">
      <canvas
        ref={canvasRef}
        width={1200}
        height={200}
        className="waveform-canvas"
      />
    </div>
  );
};

export default Waveform;
