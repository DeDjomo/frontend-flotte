// src/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiTruck, 
  FiUsers, 
  FiMapPin, 
  FiAlertTriangle,
  FiCreditCard,
  FiLifeBuoy
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  {
    icon: FiHome,
    label: 'Mon Dashboard',
    href: '/dashboard',
  },
  {
    icon: FiTruck,
    label: 'Mes Véhicules',
    href: '/vehicules',
  },
  {
    icon: FiUsers,
    label: 'Mes Chauffeurs',
    href: '/chauffeurs',
  },
  {
    icon: FiMapPin,
    label: 'Positions',
    href: '/positions',
  },
  {
    icon: FiAlertTriangle,
    label: 'Alertes',
    href: '/alertes',
  },
  {
    icon: FiCreditCard,
    label: 'Abonnement',
    href: '/abonnement',
  },
  {
    icon: FiLifeBuoy,
    label: 'Support Client',
    href: '/support',
  },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className={styles.overlay} />}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href} className={styles.menuItem}>
                  <Link
                    href={item.href}
                    className={`${styles.menuLink} ${active ? styles.active : ''}`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className={styles.menuIcon} strokeWidth={2.5} />
                    <span className={styles.menuLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;