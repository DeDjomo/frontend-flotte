// src/app/(dashboard)/support/page.tsx
'use client';

import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiCheckCircle, FiAlertCircle, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import styles from './support.module.css';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function SupportPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment ajouter un nouveau véhicule ?',
      answer: 'Pour ajouter un nouveau véhicule, allez dans la section "Véhicules" depuis le menu principal, puis cliquez sur le bouton "Nouveau Véhicule". Remplissez le formulaire avec les informations du véhicule (marque, immatriculation, type, etc.) et validez. Le véhicule sera immédiatement disponible dans votre flotte.',
    },
    {
      question: 'Comment assigner un conducteur à un véhicule ?',
      answer: 'Depuis la page des conducteurs, sélectionnez le conducteur souhaité, puis cliquez sur "Assigner un véhicule". Choisissez le véhicule dans la liste et validez. Vous pouvez également le faire depuis la fiche du véhicule en cliquant sur "Assigner un conducteur".',
    },
    {
      question: 'Comment suivre un véhicule en temps réel ?',
      answer: 'Cliquez sur un véhicule dans la liste, puis accédez à l\'onglet "Position du véhicule". Une carte interactive affichera la position actuelle du véhicule en temps réel avec ses coordonnées GPS précises.',
    },
    {
      question: 'Comment voir l\'historique des trajets ?',
      answer: 'Accédez à la fiche d\'un véhicule et sélectionnez l\'onglet "Historique des trajets". Vous y trouverez tous les trajets effectués avec les points de départ et d\'arrivée, les dates, durées, et les conducteurs associés.',
    },
    {
      question: 'Que faire en cas de problème de connexion ?',
      answer: 'Vérifiez d\'abord votre connexion internet. Si le problème persiste, essayez de rafraîchir la page (F5). En cas d\'erreur persistante, consultez le statut du système ci-dessous ou contactez-nous via le formulaire de support.',
    },
    {
      question: 'Comment enregistrer une recharge de carburant ?',
      answer: 'Allez dans la section "Recharges" du menu principal, puis cliquez sur "Nouvelle Recharge". Sélectionnez le véhicule concerné, entrez la quantité de carburant, le prix, et la localisation. Les données seront automatiquement enregistrées et visibles dans les bilans du véhicule.',
    },
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Formulaire soumis:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Support Client</h1>
        <p className={styles.subtitle}>
          Nous sommes là pour vous aider. Contactez-nous ou consultez notre FAQ.
        </p>
      </div>

      <div className={styles.grid}>
        {/* Contact Form */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Contactez-nous</h2>
          <p className={styles.cardDescription}>
            Envoyez-nous un message et nous vous répondrons dans les plus brefs délais.
          </p>

          {submitSuccess && (
            <div className={styles.successMessage}>
              <FiCheckCircle />
              <span>Message envoyé avec succès ! Nous vous répondrons bientôt.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Nom complet *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder="Votre nom"
              />
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                placeholder="votre.email@example.com"
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>
                Sujet *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                placeholder="Objet de votre demande"
              />
              {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder="Décrivez votre problème ou votre question..."
                rows={5}
              />
              {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Questions Fréquentes (FAQ)</h2>
          <p className={styles.cardDescription}>
            Trouvez rapidement des réponses aux questions les plus courantes.
          </p>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaqIndex === index}
                >
                  <span>{faq.question}</span>
                  {openFaqIndex === index ? <FiChevronUp /> : <FiChevronDown />}
                </button>
                {openFaqIndex === index && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Informations de Contact</h2>
          <p className={styles.cardDescription}>
            Vous pouvez également nous joindre directement par ces moyens.
          </p>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FiMail />
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Email</div>
                <div className={styles.contactValue}>support@fleetman.cm</div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FiPhone />
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Téléphone</div>
                <div className={styles.contactValue}>+237 6XX XXX XXX</div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FiClock />
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Horaires</div>
                <div className={styles.contactValue}>Lun - Ven: 8h - 18h</div>
                <div className={styles.contactValue}>Sam: 9h - 13h</div>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.contactIcon}>
                <FiMapPin />
              </div>
              <div className={styles.contactInfo}>
                <div className={styles.contactLabel}>Adresse</div>
                <div className={styles.contactValue}>Yaoundé, Cameroun</div>
                <div className={styles.contactValue}>Quartier Polytechnique</div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Statut du Système</h2>
          <p className={styles.cardDescription}>
            État actuel de nos services et systèmes.
          </p>

          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <div className={`${styles.statusIndicator} ${styles.statusOk}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>API Backend</div>
                <div className={styles.statusValue}>Opérationnel</div>
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={`${styles.statusIndicator} ${styles.statusOk}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>Base de données</div>
                <div className={styles.statusValue}>Opérationnel</div>
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={`${styles.statusIndicator} ${styles.statusOk}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>Suivi GPS</div>
                <div className={styles.statusValue}>Opérationnel</div>
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={`${styles.statusIndicator} ${styles.statusOk}`}>
                <FiCheckCircle />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.statusLabel}>Authentification</div>
                <div className={styles.statusValue}>Opérationnel</div>
              </div>
            </div>
          </div>

          <div className={styles.lastUpdate}>
            Dernière vérification: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  );
}