import React from 'react';

export default function AdminField({ label, htmlFor, children, hint }) {
  return (
    <label className="admin-field" htmlFor={htmlFor}>
      <span className="admin-field-label">{label}</span>
      {children}
      {hint ? <span className="admin-field-hint">{hint}</span> : null}
    </label>
  );
}
