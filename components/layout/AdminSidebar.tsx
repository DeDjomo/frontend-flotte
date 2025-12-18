// src/components/layout/AdminSidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUsers,
    FiDollarSign,
    FiBarChart2,
    FiSettings
} from 'react-icons/fi';
import styles from './Sidebar.module.css';

interface AdminSidebarProps {
    isOpen: boolean;
}

interface MenuItem {
    icon: React.ElementType;
    label: string;
    href: string;
}

const adminMenuItems: MenuItem[] = [
    {
        icon: FiHome,
        label: 'Dashboard Admin',
        href: '/admin/overview',
    },
    {
        icon: FiUsers,
        label: 'Mes Utilisateurs',
        href: '/admin/utilisateurs',
    },
    {
        icon: FiDollarSign,
        label: 'Paiements',
        href: '/admin/paiements',
    },
    {
        icon: FiBarChart2,
        label: 'Statistiques',
        href: '/admin/statistiques',
    },
    {
        icon: FiSettings,
        label: 'Paramètres',
        href: '/admin/parametres',
    },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
    const pathname = usePathname();

    const isActive = (href: string): boolean => {
        if (href === '/admin/overview') {
            return pathname === '/admin' || pathname === '/admin/overview';
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
                        {adminMenuItems.map((item) => {
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

export default AdminSidebar;
