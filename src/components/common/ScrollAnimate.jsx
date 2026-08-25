import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollAnimate({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  y = 35,
  scale = 1,
  once = true,
  amount = 0.15,
  style = {},
  as = 'div',
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      className={className}
      style={style}
      initial={{ opacity: 0, y, scale: scale !== 1 ? scale : 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.215, 0.61, 0.355, 1] }}
      {...props}
    >
      {children}
    </Component>
  );
}
