import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { sendContactMessage } from '../../api/contactApi.js';
import Button from '../common/Button.jsx';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', service_type: 'UI/UX Design' });
  const mutation = useMutation({ mutationFn: sendContactMessage });

  const serviceOptions = [
    'UI/UX Design',
    'System Architecture',
    'AI Solutions',
    'Full-Stack CMS',
  ];

  const submit = async (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <form className="glass-card contact-form-card" onSubmit={submit}>
      <div className="contact-form-header">
        <span className="contact-form-badge">START A PROJECT</span>
        <h3 className="contact-form-title">Send a Direct Message</h3>
      </div>

      {/* Service Type Selection Pills */}
      <div className="form-group">
        <label className="form-label">Select Service Focus</label>
        <div className="service-pill-group">
          {serviceOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`service-select-pill ${form.service_type === opt ? 'active' : ''}`}
              onClick={() => setForm({ ...form, service_type: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field-wrapper">
          <label className="form-label">Full Name</label>
          <div className="input-icon-wrapper">
            <span className="material-symbols-outlined field-icon">person</span>
            <input
              className="contact-input"
              placeholder="e.g. Alex Morgan"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-field-wrapper">
          <label className="form-label">Email Address</label>
          <div className="input-icon-wrapper">
            <span className="material-symbols-outlined field-icon">mail</span>
            <input
              className="contact-input"
              type="email"
              placeholder="alex@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      <div className="form-field-wrapper">
        <label className="form-label">Subject</label>
        <div className="input-icon-wrapper">
          <span className="material-symbols-outlined field-icon">topic</span>
          <input
            className="contact-input"
            placeholder="Project inquiry / Architecture advice"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
          />
        </div>
      </div>

      <div className="form-field-wrapper">
        <label className="form-label">Project Details</label>
        <div className="input-icon-wrapper">
          <span className="material-symbols-outlined field-icon textarea-icon">chat</span>
          <textarea
            className="contact-textarea"
            placeholder="Describe your vision, timeline, or technical requirements..."
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="contact-submit-btn">
        <span>{mutation.isPending ? 'Transmitting Message...' : 'Send Message'}</span>
        <span className="material-symbols-outlined btn-icon">send</span>
      </Button>

      {mutation.isSuccess ? (
        <div className="contact-alert alert-success">
          <span className="material-symbols-outlined icon">check_circle</span>
          <span>Message transmitted successfully. Our team will get back to you shortly.</span>
        </div>
      ) : null}

      {mutation.isError ? (
        <div className="contact-alert alert-error">
          <span className="material-symbols-outlined icon">error</span>
          <span>Transmission failed. Please check your details and try again.</span>
        </div>
      ) : null}
    </form>
  );
}
