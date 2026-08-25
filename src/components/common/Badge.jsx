import React from 'react';
import classNames from '../../utils/classNames.js';

export default function Badge({ className = '', children, tone = 'primary' }) {
  return <span className={classNames('badge', `badge-${tone}`, className)}>{children}</span>;
}
