import React from 'react';
import GlassCard from '../common/GlassCard.jsx';

export default function TestimonialCard({ testimonial }) {
  return (
    <GlassCard className="testimonial-card advanced-testimonial-card">
      <div>
        <div className="testimonial-card-header">
          <div className="quote-icon-box">
            <span className="material-symbols-outlined icon" aria-hidden="true">format_quote</span>
          </div>
          <div className="testimonial-rating">
            <span className="rating-stars">★★★★★</span>
            <span className="rating-label">VERIFIED</span>
          </div>
        </div>

        <p className="testimonial-copy">“{testimonial.testimonial}”</p>
      </div>

      <div className="testimonial-card-footer">
        <div className="testimonial-user-row">
          <div className="testimonial-avatar">
            <span className="avatar-letter">{(testimonial.client_name || 'D').slice(0, 1)}</span>
          </div>
          <div className="testimonial-user-info">
            <h4 className="testimonial-name">{testimonial.client_name}</h4>
            <p className="testimonial-role">
              {[testimonial.role, testimonial.company].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
