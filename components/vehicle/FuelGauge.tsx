// src/components/vehicle/FuelGauge.tsx
'use client';

import React from 'react';
import styles from './FuelGauge.module.css';

interface FuelGaugeProps {
  level: number; // 0-100
}

const FuelGauge: React.FC<FuelGaugeProps> = ({ level }) => {
  const clampedLevel = Math.max(0, Math.min(100, level));

  const getColor = () => {
    if (clampedLevel < 20) return '#ef4444'; // Rouge
    if (clampedLevel < 50) return '#f59e0b'; // Orange
    return '#22c55e'; // Vert
  };

  const getStatus = () => {
    if (clampedLevel < 20) return 'Niveau critique';
    if (clampedLevel < 50) return 'Niveau moyen';
    return 'Niveau bon';
  };

  return (
    <div className={styles.container}>
      <div className={styles.tankWrapper}>
        <svg viewBox="0 0 120 160" className={styles.svg}>
          {/* Contour du réservoir */}
          <rect
            x="20"
            y="20"
            width="80"
            height="120"
            rx="8"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3"
          />

          {/* Remplissage du carburant */}
          <rect
            x="23"
            y={23 + (117 * (100 - clampedLevel)) / 100}
            width="74"
            height={(117 * clampedLevel) / 100}
            rx="6"
            fill={getColor()}
            opacity="0.8"
            className={styles.fuel}
          />

          {/* Graduations */}
          <line x1="100" y1="35" x2="110" y2="35" stroke="#94a3b8" strokeWidth="2" />
          <text x="112" y="39" className={styles.graduation}>100%</text>

          <line x1="100" y1="80" x2="110" y2="80" stroke="#94a3b8" strokeWidth="2" />
          <text x="112" y="84" className={styles.graduation}>50%</text>

          <line x1="100" y1="125" x2="110" y2="125" stroke="#94a3b8" strokeWidth="2" />
          <text x="112" y="129" className={styles.graduation}>0%</text>

          {/* Icône carburant */}
          <path
            d="M 40 145 L 50 155 L 60 145 L 60 150 L 50 160 L 40 150 Z"
            fill="#64748b"
          />
        </svg>
      </div>

      <div className={styles.info}>
        <p className={styles.level}>{clampedLevel}%</p>
        <p className={styles.status} style={{ color: getColor() }}>
          {getStatus()}
        </p>
        <p className={styles.label}>Niveau de carburant</p>
      </div>
    </div>
  );
};

export default FuelGauge;