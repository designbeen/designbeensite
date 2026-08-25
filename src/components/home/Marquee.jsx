import React from 'react';
import { motion } from 'framer-motion';

const defaultPartners = [
  { id: 1, name: 'Nexus Corp', partner_type: 'ENTERPRISE CLIENT', logo_url: '/assets/project-nexus.png' },
  { id: 2, name: 'Aura Labs', partner_type: 'DEFI PROTOCOL', logo_url: '/assets/project-aura.png' },
  { id: 3, name: 'Quantum Ledger', partner_type: 'WEB3 INFRASTRUCTURE', logo_url: '/assets/project-vanguard.png' },
  { id: 4, name: 'Vanguard Dynamics', partner_type: 'CLOUD ENGINEERING', logo_url: null },
  { id: 5, name: 'Synapse AI', partner_type: 'NEURAL SYSTEMS', logo_url: null },
  { id: 6, name: 'Apex Financial', partner_type: 'INSTITUTIONAL PARTNER', logo_url: null },
];

export default function Marquee({ partners = [] }) {
  const partnerList = partners.length ? partners : defaultPartners;
  const repeated = [...partnerList, ...partnerList, ...partnerList];

  return (
    <motion.section
      className="partner-marquee-container"
      aria-label="Partner company logos and global clients"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
    >
      <div className="partner-marquee-label">
        <span className="live-dot" />
        <span>TRUSTED BY GLOBAL ENTERPRISES & INNOVATORS</span>
      </div>

      <div className="marquee-track-wrapper">
        <div className="marquee-track">
          {repeated.map((partner, index) => (
            <div className="partner-logo-card" key={`${partner.name}-${index}`}>
              <div className="partner-icon-mark">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={`${partner.name} logo`}
                    className="partner-logo-img"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const badge = e.target.parentElement?.querySelector('.partner-initial-badge');
                      if (badge) badge.style.display = 'block';
                    }}
                  />
                ) : null}
                <span
                  className="partner-initial-badge"
                  style={{ display: partner.logo_url ? 'none' : 'block' }}
                >
                  {partner.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <div className="partner-info">
                <strong className="partner-name">{partner.name}</strong>
                <span className="partner-tag">{partner.partner_type || partner.type || 'ENTERPRISE CLIENT'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
