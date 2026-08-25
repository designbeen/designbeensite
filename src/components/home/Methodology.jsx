import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard.jsx';
import SectionHeader from '../common/SectionHeader.jsx';

export default function Methodology({ steps = [] }) {
  const list = steps.length
    ? steps
    : [
        { step_number: 1, title: 'Strategy', description: 'Research, positioning, and technical planning.' },
        { step_number: 2, title: 'Design', description: 'Glassmorphism compositions and visual systems.' },
        { step_number: 3, title: 'Engineering', description: 'React, Express, and API implementation.' },
        { step_number: 4, title: 'Deployment', description: 'Release, observability, and stabilization.' },
        { step_number: 5, title: 'Growth', description: 'Iteration based on data and feedback.' },
      ];

  return (
    <section className="section section-soft">
      <div className="page-container">
        <SectionHeader badge="Methodology" title="A structured approach to manifesting digital futures." description="A clean process that keeps the visual system premium while the implementation stays maintainable." />
        <div className="card-grid grid-3">
          {list.map((step, index) => (
            <motion.div
              key={step.id || step.step_number}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
            >
              <GlassCard className="service-card">
                <div className="service-icon">{String(step.step_number).padStart(2, '0')}</div>
                <h3 className="service-title">{step.title}</h3>
                <p className="service-copy">{step.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
