// src/components/dashboard/ActionButton.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './ActionButton.module.css';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, href }) => {
  return (
    <Link href={href} className={styles.actionButton}>
      <span className={styles.actionIcon}>{icon}</span>
      <span className={styles.actionLabel}>{label}</span>
    </Link>
  );
};

export default ActionButton;