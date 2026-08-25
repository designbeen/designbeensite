import React from 'react';

export default function EmptyState({ title = 'Nothing here yet', description }) {
  return (
    <div className="state state-empty">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
