// src/app/template.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';

const variants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 }, // Simple fade out
};

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      exit="exit"
      // Change 'type' to 'ease' to use linear easing
      transition={{ ease: 'linear', duration: 0.3 }} // Soft fade duration
    >
      {children}
    </motion.main>
  );
}