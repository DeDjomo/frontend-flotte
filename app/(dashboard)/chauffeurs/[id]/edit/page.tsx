// src/app/(dashboard)/chauffeurs/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { driverService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from '../../nouveau/nouveau.module.css'; // Import styles from nouveau

interface DriverFormData {
    driverName: string;
    driverEmail: string;
    driverPhoneNumber: string;
    emergencyContactName: string;
    emergencyContact: string;
    personalInformations: string;
}

export default function EditChauffeurPage() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const id = Number(params.id);

    const [formData, setFormData] = useState<DriverFormData>({
        driverName: '',
        driverEmail: '',
        driverPhoneNumber: '',
        emergencyContactName: '',
        emergencyContact: '',
        personalInformations: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user?.userId && id) {
            fetchDriver();
        }
    }, [user, id]);

    const fetchDriver = async () => {
        try {
            setLoading(true);
            const driver = await driverService.getDriverById(id);
            setFormData({
                driverName: driver.driverName,
                driverEmail: driver.driverEmail,
                driverPhoneNumber: driver.driverPhoneNumber,
                emergencyContactName: driver.emergencyContactName || '',
                emergencyContact: driver.emergencyContact || '',
                personalInformations: driver.personalInformations || '',
            });
        } catch (err) {
            console.error('Erreur lors du chargement du chauffeur:', err);
            setError('Impossible de charger les données du chauffeur');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.driverName.trim()) {
            setError('Le nom est obligatoire');
            return;
        }
        if (!formData.driverEmail.trim()) {
            setError('L\'email est obligatoire');
            return;
        }
        if (!formData.driverPhoneNumber.trim()) {
            setError('Le numéro de téléphone est obligatoire');
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.driverEmail)) {
            setError('L\'email n\'est pas valide');
            return;
        }

        try {
            setSaving(true);

            console.log('📡 Mise à jour du chauffeur...');
            await driverService.updateDriver(id, {
                driverName: formData.driverName,
                driverEmail: formData.driverEmail,
                driverPhoneNumber: formData.driverPhoneNumber,
                emergencyContactName: formData.emergencyContactName || undefined,
                emergencyContact: formData.emergencyContact || undefined,
                personalInformations: formData.personalInformations || undefined,
            });

            console.log('Chauffeur mis à jour');

            // Rediriger vers la liste des chauffeurs (ou détails)
            router.push('/chauffeurs');
        } catch (err) {
            console.error('Erreur lors de la mise à jour:', err);
            setError('Impossible de mettre à jour le chauffeur. Veuillez réessayer.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    Chargement des données...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <p className={styles.breadcrumb}>
                <Link href="/chauffeurs" className={styles.breadcrumbLink}>
                    Mes Chauffeurs
                </Link>
                {' '}/{' '}
                <span className={styles.breadcrumbCurrent}>Modifier chauffeur</span>
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <h1 className={styles.formTitle}>Modifier le chauffeur</h1>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <div className={styles.formGrid}>
                    {/* Nom complet */}
                    <div className={styles.formGroup}>
                        <label htmlFor="driverName" className={styles.label}>
                            Nom complet <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            id="driverName"
                            name="driverName"
                            value={formData.driverName}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: Jean Dupont"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                        <label htmlFor="driverEmail" className={styles.label}>
                            Email <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="email"
                            id="driverEmail"
                            name="driverEmail"
                            value={formData.driverEmail}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: jean.dupont@exemple.com"
                            required
                        />
                    </div>

                    {/* Numéro de téléphone */}
                    <div className={styles.formGroup}>
                        <label htmlFor="driverPhoneNumber" className={styles.label}>
                            Numéro de téléphone <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="tel"
                            id="driverPhoneNumber"
                            name="driverPhoneNumber"
                            value={formData.driverPhoneNumber}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: +237 6 12 34 56 78"
                            required
                        />
                    </div>

                    {/* Nom du contact d'urgence */}
                    <div className={styles.formGroup}>
                        <label htmlFor="emergencyContactName" className={styles.label}>
                            Nom du contact d'urgence
                        </label>
                        <input
                            type="text"
                            id="emergencyContactName"
                            name="emergencyContactName"
                            value={formData.emergencyContactName}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: Marie Dupont"
                        />
                    </div>

                    {/* Contact d'urgence */}
                    <div className={styles.formGroup}>
                        <label htmlFor="emergencyContact" className={styles.label}>
                            Numéro du contact d'urgence
                        </label>
                        <input
                            type="tel"
                            id="emergencyContact"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleInputChange}
                            className={styles.input}
                            placeholder="Ex: +237 6 98 76 54 32"
                        />
                    </div>

                    {/* Informations personnelles */}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label htmlFor="personalInformations" className={styles.label}>
                            Informations personnelles
                        </label>
                        <textarea
                            id="personalInformations"
                            name="personalInformations"
                            value={formData.personalInformations}
                            onChange={handleInputChange}
                            className={styles.textarea}
                            placeholder="Ex: Permis B, 10 ans d'expérience, formation secourisme..."
                            rows={4}
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className={styles.formActions}>
                    <Link href="/chauffeurs" className={styles.cancelButton}>
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={saving}
                    >
                        {saving ? 'Mise à jour...' : 'Mettre à jour'}
                    </button>
                </div>
            </form>
        </div>
    );
}
