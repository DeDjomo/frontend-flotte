'use client';

import Link from 'next/link';
import { FiTruck, FiMapPin, FiUsers, FiBell, FiBarChart2, FiShield, FiArrowRight, FiZap, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './landing.module.css';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <div className={styles.logoIcon}>
            <FiTruck />
          </div>
          <span className={styles.logoText}>FleetMan</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#features" className={styles.navLink}>Fonctionnalités</a>
          <a href="#stats" className={styles.navLink}>Statistiques</a>

          {/* Bouton de thème */}
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
            title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>

          <Link href="/register" className={styles.registerButton}>
            S'inscrire
          </Link>
          <Link href="/login" className={styles.ctaButton}>
            Connexion
          </Link>
        </div>

        {/* Menu mobile avec bouton thème */}
        <div className={styles.mobileNav}>
          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Passer au thème clair' : 'Passer au thème sombre'}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          <Link href="/login" className={styles.ctaButton}>
            Connexion
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <FiZap />
            Gestion de flotte nouvelle génération
          </div>
          <h1 className={styles.heroTitle}>
            Gérez votre flotte de véhicules avec{' '}
            <span className={styles.animatedTextContainer}>
              <span className={styles.animatedText}>
                <span>intelligence</span>
                <span>sécurité</span>
                <span>simplicité</span>
                <span>fiabilité</span>
                <span>efficacité</span>
              </span>
            </span>
            {' '}et efficacité
          </h1>
          <p className={styles.heroSubtitle}>
            FleetMan est la solution complète pour optimiser la gestion de votre flotte de véhicules.
            Suivez vos véhicules en temps réel, gérez vos chauffeurs, et prenez des décisions
            éclairées grâce à nos analyses avancées.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register" className={styles.primaryButton}>
              Créer un compte gratuit
              <FiArrowRight />
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              Se connecter
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Fonctionnalités puissantes</h2>
          <p className={styles.sectionSubtitle}>
            Tout ce dont vous avez besoin pour gérer efficacement votre flotte de véhicules,
            au même endroit.
          </p>
        </div>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiMapPin />
            </div>
            <h3 className={styles.featureTitle}>Suivi en temps réel</h3>
            <p className={styles.featureDescription}>
              Visualisez la position exacte de tous vos véhicules sur une carte interactive.
              Suivez les trajets et optimisez vos itinéraires.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiUsers />
            </div>
            <h3 className={styles.featureTitle}>Gestion des chauffeurs</h3>
            <p className={styles.featureDescription}>
              Assignez des chauffeurs à vos véhicules, suivez leurs performances
              et gérez les plannings efficacement.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiBell />
            </div>
            <h3 className={styles.featureTitle}>Alertes intelligentes</h3>
            <p className={styles.featureDescription}>
              Recevez des notifications en temps réel pour les événements importants :
              maintenance, carburant bas, zones de géofencing.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiBarChart2 />
            </div>
            <h3 className={styles.featureTitle}>Analyses avancées</h3>
            <p className={styles.featureDescription}>
              Tableaux de bord détaillés avec indicateurs clés : consommation de carburant,
              kilométrage, coûts de maintenance.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiTruck />
            </div>
            <h3 className={styles.featureTitle}>Gestion complète</h3>
            <p className={styles.featureDescription}>
              Centralisez toutes les informations de vos véhicules : documents, assurances,
              historique de maintenance.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <FiShield />
            </div>
            <h3 className={styles.featureTitle}>Sécurité avancée</h3>
            <p className={styles.featureDescription}>
              Données sécurisées et chiffrées. Contrôle d'accès par rôle pour
              protéger les informations sensibles.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>99.9%</div>
            <div className={styles.statLabel}>Disponibilité du service</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>24/7</div>
            <div className={styles.statLabel}>Suivi en temps réel</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>-30%</div>
            <div className={styles.statLabel}>Réduction des coûts</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>+50%</div>
            <div className={styles.statLabel}>Efficacité opérationnelle</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Prêt à optimiser votre flotte ?</h2>
          <p className={styles.ctaText}>
            Rejoignez FleetMan et transformez la gestion de vos véhicules dès aujourd'hui.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/register" className={styles.primaryButton}>
              Créer un compte gratuit
              <FiArrowRight />
            </Link>
            <Link href="/login" className={styles.secondaryButton}>
              J'ai déjà un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <div className={styles.logoIcon}>
              <FiTruck />
            </div>
            <span className={styles.logoText}>FleetMan</span>
          </div>
          <p className={styles.footerText}>
            FleetMan © 2025 - Tous droits réservés | Solution de gestion de flotte intelligente
          </p>
        </div>
      </footer>
    </div>
  );
}
