import React from 'react';

export default function Loading({ label = 'Loading content' }) {
  return <div className="state state-loading">{label}</div>;
}
