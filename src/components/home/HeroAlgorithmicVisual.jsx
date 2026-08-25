import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function HeroAlgorithmicVisual({ fallbackImage, altText }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [metrics, setMetrics] = useState({ fps: 120, latency: 1.2, activeNodes: 48 });
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = containerRef.current?.offsetWidth || 480);
    let height = (canvas.height = containerRef.current?.offsetHeight || 480);

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      width = canvas.width = containerRef.current.offsetWidth;
      height = canvas.height = containerRef.current.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initialize Algorithmic Particle Mesh
    const numParticles = 44;
    const blueColors = ['#00d4ff', '#0088ff', '#2563eb', '#38bdf8', '#60a5fa'];
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: Math.random() * 2 + 1.5,
      color: blueColors[Math.floor(Math.random() * blueColors.length)],
      pulse: Math.random() * Math.PI * 2,
    }));

    let angle = 0;
    let frameCount = 0;

    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = containerRef.current;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Render loop
    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing background grid pattern
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(0, 140, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Center Algorithmic Core Rings
      const centerX = width / 2;
      const centerY = height / 2;
      angle += 0.008;

      // Outer Rotating Hex / Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.32, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner Counter-Rotating Pulsing Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 1.5);
      ctx.strokeStyle = 'rgba(0, 119, 255, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(width, height) * 0.22, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Radar Sweep Line
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 2);
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.35);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.32)');
      gradient.addColorStop(1, 'rgba(0, 119, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.min(width, height) * 0.35, 0, Math.PI * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Update & Draw Algorithmic Particles + Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move particle
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on borders
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interactive push
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 100 && dist > 0) {
          p.x -= (dx / dist) * 1.5;
          p.y -= (dy / dist) * 1.5;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const distance = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (distance < 110) {
            const alpha = (1 - distance / 110) * 0.45;
            const lineGrad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
            lineGrad.addColorStop(0, p.color);
            lineGrad.addColorStop(1, p2.color);
            ctx.strokeStyle = lineGrad;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }

        // Draw node dot
        p.pulse += 0.04;
        const currentRadius = p.radius + Math.sin(p.pulse) * 0.6;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(1, currentRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Update telemetry state occasionally
      if (frameCount % 60 === 0) {
        setMetrics({
          fps: 118 + Math.floor(Math.random() * 4),
          latency: (1.1 + Math.random() * 0.3).toFixed(1),
          activeNodes: numParticles,
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  if (useFallback) {
    return (
      <img
        src={fallbackImage}
        alt={altText || 'DesignBeen hero visual'}
        onError={(event) => {
          event.currentTarget.src = '/hero-placeholder.jpg';
        }}
      />
    );
  }

  return (
    <div className="hero-algo-container" ref={containerRef}>
      <canvas ref={canvasRef} className="hero-algo-canvas" />

      {/* Laser Scan Line Overlay */}
      <div className="hero-algo-scanner" />

      {/* Top HUD Badges */}
      <div className="hero-algo-hud hero-algo-hud-top">
        <div className="hero-algo-badge">
          <span className="hero-algo-dot" />
          <span>NEURAL CORE ACTIVE</span>
        </div>
        <div className="hero-algo-badge hero-algo-badge-sec">
          <span>{metrics.fps} FPS</span>
          <span className="divider">•</span>
          <span>{metrics.latency}ms</span>
        </div>
      </div>

      {/* Center Algorithmic Node HUD Label */}
      <div className="hero-algo-center-badge">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.88, 1, 0.88] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="hero-algo-core-tag"
        >
          <span className="material-symbols-outlined icon">memory</span>
          <span>ALGORITHM v4.28</span>
        </motion.div>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="hero-algo-hud hero-algo-hud-bottom">
        <div className="hero-algo-code-stream">
          <code>f(x, y) = ∫ λ(t)·e^(-iωt) dt</code>
          <small>OPTIMIZING GRAPH MESH...</small>
        </div>
        <div className="hero-algo-wave">
          <svg viewBox="0 0 120 28" width="80" height="20">
            <motion.path
              d="M0 14 Q 15 2, 30 14 T 60 14 T 90 14 T 120 14"
              fill="none"
              stroke="#00ccf9"
              strokeWidth="2"
              animate={{
                d: [
                  'M0 14 Q 15 2, 30 14 T 60 14 T 90 14 T 120 14',
                  'M0 14 Q 15 26, 30 14 T 60 14 T 90 14 T 120 14',
                  'M0 14 Q 15 2, 30 14 T 60 14 T 90 14 T 120 14',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
