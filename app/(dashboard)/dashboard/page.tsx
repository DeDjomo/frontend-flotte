// src/app/(dashboard)/dashboard/page.tsx
import React from 'react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bonjour Dashboard</h1>
    </div>
  );
}