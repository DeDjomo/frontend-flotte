// src/app/(dashboard)/abonnement/page.tsx
'use client';

import React, { useState } from 'react';
import { FiCheck, FiX, FiCreditCard, FiSmartphone } from 'react-icons/fi';
import styles from './abonnement.module.css';

interface Plan {
  name: string;
  price: string;
  period: string;
  vehicles: string;
  features: string[];
  isPopular?: boolean;
}

type PaymentMethod = 'card' | 'orange' | 'momo';

export default function AbonnementPage() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const plans: Plan[] = [
    {
      name: 'Starter',
      price: '15 000',
      period: 'mois',
      vehicles: '1-5 véhicules',
      features: [
        'Suivi GPS en temps réel',
        'Historique des trajets (30 jours)',
        'Gestion basique de la flotte',
        'Alertes de maintenance',
        'Support par email',
      ],
    },
    {
      name: 'Professional',
      price: '35 000',
      period: 'mois',
      vehicles: '6-20 véhicules',
      features: [
        'Tout du plan Starter',
        'Historique illimité',
        'Rapports et analyses avancés',
        'Alertes personnalisées',
        'Gestion des conducteurs',
        'API d\'intégration',
        'Support prioritaire',
      ],
      isPopular: true,
    },
    {
      name: 'Enterprise',
      price: 'Sur devis',
      period: '',
      vehicles: 'Illimité',
      features: [
        'Tout du plan Professional',
        'Multi-utilisateurs',
        'Personnalisation complète',
        'Intégration personnalisée',
        'Formation dédiée',
        'Support 24/7',
        'Gestionnaire de compte dédié',
      ],
    },
  ];

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
    resetForm();
  };

  const resetForm = () => {
    setCardNumber('');
    setCardExpiry('');
    setCardCVV('');
    setCardName('');
    setPhoneNumber('');
    setErrors({});
  };

  const validateCardPayment = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!cardName.trim()) {
      newErrors.cardName = 'Nom requis';
    }

    if (!cardNumber.trim()) {
      newErrors.cardNumber = 'Numéro de carte requis';
    } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Numéro de carte invalide (16 chiffres)';
    }

    if (!cardExpiry.trim()) {
      newErrors.cardExpiry = 'Date d\'expiration requise';
    } else if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      newErrors.cardExpiry = 'Format invalide (MM/YY)';
    }

    if (!cardCVV.trim()) {
      newErrors.cardCVV = 'CVV requis';
    } else if (!/^\d{3,4}$/.test(cardCVV)) {
      newErrors.cardCVV = 'CVV invalide (3-4 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMobilePayment = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Numéro de téléphone requis';
    } else if (!/^(6|2)\d{8}$/.test(phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Numéro invalide (9 chiffres commençant par 6 ou 2)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    let isValid = false;

    if (paymentMethod === 'card') {
      isValid = validateCardPayment();
    } else {
      isValid = validateMobilePayment();
    }

    if (!isValid) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      console.log('Paiement effectué:', {
        plan: selectedPlan,
        method: paymentMethod,
        data: paymentMethod === 'card' ? { cardNumber, cardExpiry } : { phoneNumber }
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
      }, 3000);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Choisissez votre plan</h1>
        <p className={styles.subtitle}>
          Sélectionnez le plan qui convient le mieux à votre flotte de véhicules
        </p>
      </div>

      <div className={styles.plansGrid}>
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${styles.planCard} ${plan.isPopular ? styles.popularPlan : ''}`}
          >
            {plan.isPopular && <div className={styles.popularBadge}>Populaire</div>}

            <div className={styles.planHeader}>
              <h2 className={styles.planName}>{plan.name}</h2>
              <div className={styles.planPrice}>
                <span className={styles.price}>{plan.price}</span>
                {plan.period && <span className={styles.period}>FCFA / {plan.period}</span>}
              </div>
              <p className={styles.planVehicles}>{plan.vehicles}</p>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={styles.feature}>
                  <FiCheck className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`${styles.selectButton} ${plan.isPopular ? styles.selectButtonPrimary : ''}`}
              onClick={() => handleSelectPlan(plan)}
            >
              Choisir ce plan
            </button>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              className={styles.closeButton}
              onClick={() => setShowPaymentModal(false)}
            >
              <FiX />
            </button>

            <h2 className={styles.modalTitle}>
              {paymentSuccess ? 'Paiement réussi !' : `Paiement - Plan ${selectedPlan?.name}`}
            </h2>

            {paymentSuccess ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <FiCheck />
                </div>
                <p>Votre abonnement a été activé avec succès !</p>
                <p className={styles.successSubtext}>
                  Vous pouvez maintenant profiter de toutes les fonctionnalités du plan {selectedPlan?.name}.
                </p>
              </div>
            ) : (
              <>
                <div className={styles.planSummary}>
                  <div className={styles.summaryRow}>
                    <span>Plan</span>
                    <strong>{selectedPlan?.name}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Prix</span>
                    <strong>{selectedPlan?.price} FCFA</strong>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className={styles.paymentMethods}>
                  <label className={styles.sectionLabel}>Méthode de paiement</label>
                  <div className={styles.paymentButtons}>
                    <button
                      className={`${styles.paymentMethodButton} ${paymentMethod === 'card' ? styles.active : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <FiCreditCard />
                      <span>Carte bancaire</span>
                    </button>
                    <button
                      className={`${styles.paymentMethodButton} ${paymentMethod === 'orange' ? styles.active : ''}`}
                      onClick={() => setPaymentMethod('orange')}
                    >
                      <FiSmartphone />
                      <span>Orange Money</span>
                    </button>
                    <button
                      className={`${styles.paymentMethodButton} ${paymentMethod === 'momo' ? styles.active : ''}`}
                      onClick={() => setPaymentMethod('momo')}
                    >
                      <FiSmartphone />
                      <span>MTN MOMO</span>
                    </button>
                  </div>
                </div>

                {/* Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div className={styles.paymentForm}>
                    <div className={styles.formGroup}>
                      <label>Nom sur la carte</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="John Doe"
                        className={errors.cardName ? styles.inputError : ''}
                      />
                      {errors.cardName && <span className={styles.error}>{errors.cardName}</span>}
                    </div>

                    <div className={styles.formGroup}>
                      <label>Numéro de carte</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={errors.cardNumber ? styles.inputError : ''}
                      />
                      {errors.cardNumber && <span className={styles.error}>{errors.cardNumber}</span>}
                    </div>

                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Date d'expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={errors.cardExpiry ? styles.inputError : ''}
                        />
                        {errors.cardExpiry && <span className={styles.error}>{errors.cardExpiry}</span>}
                      </div>

                      <div className={styles.formGroup}>
                        <label>CVV</label>
                        <input
                          type="text"
                          value={cardCVV}
                          onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, ''))}
                          placeholder="123"
                          maxLength={4}
                          className={errors.cardCVV ? styles.inputError : ''}
                        />
                        {errors.cardCVV && <span className={styles.error}>{errors.cardCVV}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {/* Orange Money Form */}
                {paymentMethod === 'orange' && (
                  <div className={styles.paymentForm}>
                    <div className={styles.mobilePaymentInfo}>
                      <FiSmartphone className={styles.infoIcon} />
                      <div>
                        <p className={styles.infoTitle}>Paiement Orange Money</p>
                        <p className={styles.infoText}>
                          Vous recevrez une notification sur votre téléphone pour valider le paiement
                        </p>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Numéro de téléphone Orange Money</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="6XX XXX XXX"
                        maxLength={9}
                        className={errors.phoneNumber ? styles.inputError : ''}
                      />
                      {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                    </div>
                  </div>
                )}

                {/* MTN Mobile Money Form */}
                {paymentMethod === 'momo' && (
                  <div className={styles.paymentForm}>
                    <div className={styles.mobilePaymentInfo}>
                      <FiSmartphone className={styles.infoIcon} />
                      <div>
                        <p className={styles.infoTitle}>Paiement MTN Mobile Money</p>
                        <p className={styles.infoText}>
                          Vous recevrez une notification sur votre téléphone pour valider le paiement
                        </p>
                      </div>
                    </div>

                    <div className={styles.formGroup}>
                      <label>Numéro de téléphone MTN MOMO</label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="6XX XXX XXX"
                        maxLength={9}
                        className={errors.phoneNumber ? styles.inputError : ''}
                      />
                      {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
                    </div>
                  </div>
                )}

                <button
                  className={styles.payButton}
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Traitement en cours...' : `Payer ${selectedPlan?.price} FCFA`}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}