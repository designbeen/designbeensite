import React from 'react';
import { motion } from 'framer-motion';
import Badge from './Badge.jsx';

export default function SectionHeader({ badge, title, description, align = 'center' }) {
  return (
    <motion.div
      className={`section-header section-header-${align}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
    >
      {badge ? <Badge>{badge}</Badge> : null}
      {title ? <h2 className="section-title">{title}</h2> : null}
      {description ? <p className="section-description">{description}</p> : null}
    </motion.div>
  );
}
