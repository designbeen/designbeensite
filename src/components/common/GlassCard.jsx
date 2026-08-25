import React from 'react';
import classNames from '../../utils/classNames.js';

export default function GlassCard({ as: Component = 'div', className = '', children, ...props }) {
  return (
    <Component className={classNames('glass-card', className)} {...props}>
      {children}
    </Component>
  );
}
