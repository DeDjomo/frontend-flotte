// src/components/dashboard/StatCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './StatCard.module.css';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  label: string;
  activeCount?: number;
  activeLabel?: string;
  inactiveCount?: number;
  inactiveLabel?: string;
  href: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  count,
  label,
  activeCount,
  activeLabel,
  inactiveCount,
  inactiveLabel,
  href,
  loading = false
}) => {
  if (loading) {
    return (
      <div className={styles.statCard}>
        <div className={styles.skeleton}>Chargement...</div>
      </div>
    );
  }

  return (
    <Link href={href} className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon}>{icon}</div>
        <h2 className={styles.statTitle}>{title}</h2>
      </div>
      <div className={styles.statContent}>
        <p className={styles.statNumber}>{count}</p>
        <p className={styles.statLabel}>{label}</p>
        {(activeCount !== undefined || inactiveCount !== undefined) && (
          <div className={styles.statBadges}>
            {activeCount !== undefined && (
              <span className={`${styles.badge} ${styles.badgeSuccess}`}>
                {activeCount} {activeLabel}
              </span>
            )}
            {inactiveCount !== undefined && (
              <span className={`${styles.badge} ${styles.badgeInactive}`}>
                {inactiveCount} {inactiveLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default StatCard;