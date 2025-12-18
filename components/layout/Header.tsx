// src/components/layout/Header.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiMenu, FiHelpCircle, FiUser } from 'react-icons/fi';
import styles from './Header.module.css';

interface HeaderProps {
  userName?: string;
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'User',
  isSidebarOpen,
  onMenuToggle 
}) => {
  return (
    <header className={styles.header}>
      {/* Left Section - Menu Toggle & Logo */}
      <div className={styles.leftSection}>
        <button
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
          aria-expanded={isSidebarOpen}
        >
          <FiMenu className={styles.menuIcon} />
        </button>

        <Link href="/dashboard" className={styles.logoLink}>
          <Image
            src="/logo-bleu.svg"
            alt="FleetMan"
            width={120}
            height={40}
            priority
            className={styles.logo}
          />
        </Link>
      </div>

      {/* Right Section - Help & User */}
      <div className={styles.rightSection}>
        {/* Help Icon */}
        <Link 
          href="/support" 
          className={styles.helpButton}
          aria-label="Aide et support"
        >
          <FiHelpCircle className={styles.helpIcon} />
        </Link>

        {/* User Badge */}
        <Link 
          href="/profile" 
          className={styles.userBadge}
          aria-label={`Profil de ${userName}`}
        >
          <div className={styles.userIconWrapper}>
            <FiUser className={styles.userIcon} />
          </div>
          <span className={styles.userName}>{userName}</span>
        </Link>
      </div>
    </header>
  );
};

export default Header;