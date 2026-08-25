import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard.jsx';
import Button from '../common/Button.jsx';
import HeroAlgorithmicVisual from './HeroAlgorithmicVisual.jsx';
import HeroNeuralBackground from './HeroNeuralBackground.jsx';

export default function Hero({ hero, settings }) {
  const image = hero?.image_url || settings?.hero_image_url || '/hero-placeholder.jpg';
  const title = hero?.title || 'Engineering';
  const highlightedText = hero?.highlighted_text || 'Excellence in Design.';
  const brandName = settings?.site_name || 'DesignBeen';
  const marqueeItems = Array(12).fill(brandName);

  return (
    <section className="hero">
      <HeroNeuralBackground />
      <div className="hero-bg-marquee" aria-hidden="true">
        <div className="hero-bg-marquee-track">
          {marqueeItems.map((name, index) => (
            <span key={`${name}-${index}`} className="hero-bg-marquee-item">
              {name}
            </span>
          ))}
        </div>
      </div>
      <div className="page-container hero-grid">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="hero-kicker">{hero?.badge || 'Visionary Interfaces'}</div>
          <h1 className="hero-title">
            {title} <span className="accent">{highlightedText}</span>
          </h1>
          <p className="hero-copy">{hero?.description || 'A premium high-tech agency crafting futuristic digital experiences with glassmorphism, motion, and conversion-focused storytelling.'}</p>
          <div className="hero-actions">
            <Button as={Link} to={hero?.primary_cta_url || '/portfolio'}>
              {hero?.primary_cta_label || 'Explore Our Work'}
            </Button>
            <Button as={Link} to={hero?.secondary_cta_url || '/contact'} variant="secondary">
              {hero?.secondary_cta_label || 'Start a Project'}
            </Button>
          </div>
        </motion.div>
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.215, 0.61, 0.355, 1] }}
        >
          <div className="hero-orb" />
          <GlassCard className="hero-visual-card">
            <HeroAlgorithmicVisual fallbackImage={image} altText={hero?.image_alt} />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
