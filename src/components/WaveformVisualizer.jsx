import React, { useRef, useEffect } from 'react';

export const WaveformVisualizer = ({ isPlaying, primaryColor = '#8b5cf6', secondaryColor = '#06b6d4' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw animated spectrum bars
      const numBars = 32;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        
        // Calculate bar height dynamically based on sine waves & play state
        let barHeight = 6;
        if (isPlaying) {
          barHeight = Math.sin(phase + i * 0.3) * (height / 2.5) + Math.cos(phase * 1.5 + i * 0.2) * 8 + (height / 3);
          barHeight = Math.max(4, Math.abs(barHeight));
        }

        const gradient = ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
        gradient.addColorStop(0, primaryColor);
        gradient.addColorStop(1, secondaryColor);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, centerY - barHeight / 2, barWidth, barHeight, 3);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.12;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, primaryColor, secondaryColor]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={36}
      className="w-48 h-9 rounded-xl bg-neutral-950/60 border border-neutral-900 px-1"
    />
  );
};
