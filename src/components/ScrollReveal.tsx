'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blurAmount?: string;
}

export default function ScrollReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  yOffset = 30,
  blurAmount = '12px'
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: yOffset, 
        filter: `blur(${blurAmount})` 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: 'blur(0px)' 
      }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.16, 1, 0.3, 1] // Custom elegant cubic bezier easeOut
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
