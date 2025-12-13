// src/components/vehicle/MetricCard.tsx
'use client';

import React from 'react';
import styles from './MetricCard.module.css';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  icon, 
  label, 
  value, 
  unit,
  color = 'blue' 
}) => {
  return (
    <div className={`${styles.card} ${styles[color]}`}>
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>
          {value}
          {unit && <span className={styles.unit}>{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export default MetricCard;