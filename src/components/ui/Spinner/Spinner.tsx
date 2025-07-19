// src/components/ui/Spinner/Spinner.tsx
'use client'; // This component will have client-side interactivity

import React from 'react';
import { Loader } from 'lucide-react'; // Lucide icon for spinner
import { motion } from 'framer-motion'; // Framer Motion for animations
import styles from './Spinner.module.scss';

interface SpinnerProps {
  size?: number; // Icon size
  className?: string; // Additional classes for the container
}

const Spinner: React.FC<SpinnerProps> = ({ size = 48, className = '' }) => {
  return (
    <div className={`${styles.spinnerContainer} ${className}`}>
      <motion.div
        className={styles.spinner}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
      >
        <Loader size={size} />
      </motion.div>
    </div>
  );
};

export default Spinner;