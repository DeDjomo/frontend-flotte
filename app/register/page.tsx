'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './register.module.css';
import { FiUser, FiMail, FiLock, FiPhone, FiTruck, FiAlertCircle, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { userService } from '@/app/lib/services';

export default function RegisterPage() {
    const router = useRouter();

    // Champs du formulaire
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // États UI
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation de l'email
    const isEmailValid = email.length === 0 || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Validation du téléphone (minimum 9 chiffres)
    const isPhoneValid = phone.length === 0 || /^[+]?[\d\s-]{9,}$/.test(phone);

    // Validation du mot de passe (minimum 6 caractères)
    const isPasswordValid = password.length === 0 || password.length >= 6;

    // Vérification de la correspondance des mots de passe
    const passwordsMatch = confirmPassword.length === 0 || password === confirmPassword;

    // Calcul de la force du mot de passe
    const getPasswordStrength = (pwd: string): { level: number; text: string } => {
        if (pwd.length === 0) return { level: 0, text: '' };
        if (pwd.length < 6) return { level: 1, text: 'Trop court' };

        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z0-9]/.test(pwd)) score++;

        if (score <= 1) return { level: 1, text: 'Faible' };
        if (score === 2) return { level: 2, text: 'Moyen' };
        if (score >= 3) return { level: 3, text: 'Fort' };

        return { level: 0, text: '' };
    };

    const passwordStrength = getPasswordStrength(password);

    // Validation globale du formulaire
    const isFormValid =
        nom.length > 0 &&
        prenom.length > 0 &&
        email.length > 0 &&
        isEmailValid &&
        phone.length > 0 &&
        isPhoneValid &&
        password.length >= 6 &&
        password === confirmPassword;

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation supplémentaire
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            setLoading(false);
            return;
        }

        try {
            console.log('📝 Inscription en cours...');

            // Combiner nom et prénom pour userName
            const userName = `${prenom} ${nom}`;

            // Appeler l'API pour créer l'utilisateur
            await userService.createUser({
                userName,
                userEmail: email,
                userPassword: password,
                userPhoneNumber: phone,
            });

            console.log('✅ Inscription réussie');
            setSuccess('Inscription réussie ! Redirection vers la connexion...');

            // Rediriger vers la page de connexion après 2 secondes
            setTimeout(() => {
                router.push('/login');
            }, 2000);

        } catch (err: any) {
            console.error('❌ Erreur d\'inscription:', err);

            // Messages d'erreur personnalisés
            if (err.response?.status === 409 || err.message?.includes('existe')) {
                setError('Un compte avec cet email existe déjà');
            } else if (err.response?.status === 400) {
                setError('Données invalides. Veuillez vérifier vos informations.');
            } else if (err.message?.includes('réseau') || err.message?.includes('network')) {
                setError('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
            } else {
                setError('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.registerCard}>
                {/* Logo et titre */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <FiTruck className={styles.logoIcon} />
                    </div>
                    <h1 className={styles.title}>FleetMan</h1>
                    <p className={styles.subtitle}>Créer un compte</p>
                </div>

                {/* Formulaire d'inscription */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.error} role="alert">
                            <FiAlertCircle aria-hidden="true" />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className={styles.success} role="status">
                            <FiCheckCircle aria-hidden="true" />
                            <span>{success}</span>
                        </div>
                    )}

                    {/* Nom et Prénom sur la même ligne */}
                    <div className={styles.nameGrid}>
                        <div className={styles.formGroup}>
                            <label htmlFor="prenom" className={styles.label}>
                                <FiUser aria-hidden="true" />
                                <span>Prénom</span>
                            </label>
                            <input
                                id="prenom"
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                className={styles.input}
                                placeholder="Jean"
                                required
                                autoFocus
                                autoComplete="given-name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="nom" className={styles.label}>
                                <FiUser aria-hidden="true" />
                                <span>Nom</span>
                            </label>
                            <input
                                id="nom"
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                className={styles.input}
                                placeholder="Dupont"
                                required
                                autoComplete="family-name"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            <FiMail aria-hidden="true" />
                            <span>Email</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                            placeholder="votre.email@example.com"
                            required
                            autoComplete="email"
                            aria-invalid={!isEmailValid}
                        />
                        {!isEmailValid && email.length > 0 && (
                            <small style={{ color: 'var(--error-text)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                Format d'email invalide
                            </small>
                        )}
                    </div>

                    {/* Téléphone */}
                    <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                            <FiPhone aria-hidden="true" />
                            <span>Téléphone</span>
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={styles.input}
                            placeholder="+237 6XX XXX XXX"
                            required
                            autoComplete="tel"
                            aria-invalid={!isPhoneValid}
                        />
                        {!isPhoneValid && phone.length > 0 && (
                            <small style={{ color: 'var(--error-text)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                Numéro de téléphone invalide
                            </small>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            <FiLock aria-hidden="true" />
                            <span>Mot de passe</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={styles.togglePassword}
                                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {password.length > 0 && (
                            <>
                                <div className={styles.passwordStrength}>
                                    <div className={`${styles.strengthBar} ${passwordStrength.level >= 1 ? (passwordStrength.level === 1 ? styles.weak : passwordStrength.level === 2 ? styles.medium : styles.strong) : ''}`}></div>
                                    <div className={`${styles.strengthBar} ${passwordStrength.level >= 2 ? (passwordStrength.level === 2 ? styles.medium : styles.strong) : ''}`}></div>
                                    <div className={`${styles.strengthBar} ${passwordStrength.level >= 3 ? styles.strong : ''}`}></div>
                                </div>
                                <small className={styles.strengthText}>
                                    {passwordStrength.text} {password.length < 6 && '(6 caractères minimum)'}
                                </small>
                            </>
                        )}
                    </div>

                    {/* Confirmation mot de passe */}
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword" className={styles.label}>
                            <FiLock aria-hidden="true" />
                            <span>Confirmer le mot de passe</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={styles.togglePassword}
                                aria-label={showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                            >
                                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        {!passwordsMatch && confirmPassword.length > 0 && (
                            <small style={{ color: 'var(--error-text)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                                Les mots de passe ne correspondent pas
                            </small>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading || !isFormValid}
                        aria-busy={loading}
                    >
                        {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                    </button>

                    {/* Lien vers connexion */}
                    <div className={styles.loginLink}>
                        <p>
                            Déjà un compte ?{' '}
                            <Link href="/login">Se connecter</Link>
                        </p>
                    </div>
                </form>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        FleetMan © 2025 - Tous droits réservés
                    </p>
                </div>
            </div>
        </div>
    );
}
