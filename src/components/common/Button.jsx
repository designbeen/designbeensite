import React from 'react';
import classNames from '../../utils/classNames.js';

export default function Button({ as: Component = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Component className={classNames('button', `button-${variant}`, className)} {...props}>
      {children}
    </Component>
  );
}
