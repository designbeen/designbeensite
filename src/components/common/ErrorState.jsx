import React from 'react';

export default function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="state state-error">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {onRetry ? (
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
