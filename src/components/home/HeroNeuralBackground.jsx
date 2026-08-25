import React, { useEffect, useRef } from 'react';

export default function HeroNeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth;
      height = canvas.height = canvas.parentElement.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Neural Nodes & Synaptic Signals
    const nodeCount = Math.floor(Math.min(width, 1400) / 18);
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1.8,
      color: Math.random() > 0.4 ? '#00d4ff' : '#0077ff',
    }));

    const signals = [];
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const heroSection = canvas.parentElement;
    if (heroSection) {
      heroSection.addEventListener('mousemove', handleMouseMove);
      heroSection.addEventListener('mouseleave', handleMouseLeave);
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Randomly trigger neural signals
      if (frame % 12 === 0 && nodes.length > 2) {
        const fromIdx = Math.floor(Math.random() * nodes.length);
        const p1 = nodes[fromIdx];
        let nearest = null;
        let minDist = 180;
        for (let i = 0; i < nodes.length; i++) {
          if (i === fromIdx) continue;
          const dist = Math.hypot(p1.x - nodes[i].x, p1.y - nodes[i].y);
          if (dist < minDist) {
            minDist = dist;
            nearest = nodes[i];
          }
        }
        if (nearest) {
          signals.push({
            x1: p1.x,
            y1: p1.y,
            x2: nearest.x,
            y2: nearest.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.03,
          });
        }
      }

      // Update & Draw Synaptic Signal Pulses
      for (let i = signals.length - 1; i >= 0; i--) {
        const s = signals[i];
        s.progress += s.speed;
        if (s.progress >= 1) {
          signals.splice(i, 1);
          continue;
        }
        const currX = s.x1 + (s.x2 - s.x1) * s.progress;
        const currY = s.y1 + (s.y2 - s.y1) * s.progress;
        ctx.fillStyle = '#00d4ff';
        ctx.shadowColor = '#00d4ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(currX, currY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update & Draw Neural Nodes & Synapses
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Mouse interaction
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          n.x -= (dx / dist) * 1.2;
          n.y -= (dy / dist) * 1.2;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const d = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (d < 140) {
            const opacity = (1 - d / 140) * 0.65;
            ctx.strokeStyle = `rgba(0, 180, 255, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw node
        ctx.fillStyle = n.color;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (heroSection) {
        heroSection.removeEventListener('mousemove', handleMouseMove);
        heroSection.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="hero-neural-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-neural-canvas" />
    </div>
  );
}
