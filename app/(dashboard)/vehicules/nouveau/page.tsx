// src/app/(dashboard)/vehicules/nouveau/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUpload } from 'react-icons/fi';
import { vehicleService } from '@/app/lib/services';
import { useAuth } from '@/app/contexts/AuthContext';
import styles from './nouveau.module.css';

interface VehicleFormData {
  vehicleMake: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  vehicleName: string;
  trackingDeviceId: string;
  vehicleImage?: File | null;
}

export default function NouveauVehiculePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<VehicleFormData>({
    vehicleMake: '',
    vehicleType: '',
    vehicleRegistrationNumber: '',
    vehicleName: '',
    trackingDeviceId: '',
    vehicleImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        vehicleImage: file
      }));

      // Créer un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.vehicleMake.trim()) {
      setError('La marque est obligatoire');
      return;
    }
    if (!formData.vehicleName.trim()) {
      setError('Le service du véhicule est obligatoire');
      return;
    }
    if (!formData.vehicleRegistrationNumber.trim()) {
      setError('L\'immatriculation est obligatoire');
      return;
    }
    if (!formData.vehicleType.trim()) {
      setError('Le type de véhicule est obligatoire');
      return;
    }
    if (!formData.trackingDeviceId.trim()) {
      setError('L\'identifiant du dispositif de suivi est obligatoire');
      return;
    }

    try {
      setLoading(true);

      if (!user?.userId) {
        setError('Utilisateur non connecté');
        return;
      }

      // Créer le véhicule
      console.log('📡 Création du véhicule...');
      const newVehicle = await vehicleService.createVehicle({
        vehicleMake: formData.vehicleMake,
        vehicleName: formData.vehicleName,
        vehicleRegistrationNumber: formData.vehicleRegistrationNumber,
        vehicleType: formData.vehicleType,
        vehicleNumberPassengers: 5, // Valeur par défaut
        userId: user.userId,
      });

      console.log('Véhicule créé:', newVehicle);

      // Si une image a été sélectionnée, l'uploader
      if (formData.vehicleImage) {
        try {
          console.log('📤 Upload de l\'image...');
          await vehicleService.uploadVehicleImage(
            newVehicle.vehicleId,
            formData.vehicleImage
          );
          console.log('Image uploadée');
        } catch (err) {
          console.warn('Erreur lors de l\'upload de l\'image:', err);
          // Ne pas bloquer si l'upload échoue
        }
      }

      // Rediriger vers la liste des véhicules
      router.push('/vehicules');
    } catch (err) {
      console.error('Erreur lors de la création du véhicule:', err);
      setError('Impossible de créer le véhicule. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.breadcrumb}>
        <Link href="/vehicules" className={styles.breadcrumbLink}>
          Mes Véhicules
        </Link>
        {' '}/{' '}
        <span className={styles.breadcrumbCurrent}>Nouveau véhicule</span>
      </p>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Zone de téléversement d'image */}
        <div className={styles.uploadZone}>
          <input
            type="file"
            id="vehicleImage"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          <label htmlFor="vehicleImage" className={styles.uploadLabel}>
            {imagePreview ? (
              <img src={imagePreview} alt="Aperçu" className={styles.imagePreview} />
            ) : (
              <>
                <svg
                  className={styles.carIcon}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
                <span className={styles.uploadText}>Téléverser la photo du véhicule</span>
              </>
            )}
          </label>
        </div>

        {/* Champs du formulaire */}
        <div className={styles.formGroup}>
          <label htmlFor="vehicleMake" className={styles.label}>
            Marque*
          </label>
          <input
            type="text"
            id="vehicleMake"
            name="vehicleMake"
            value={formData.vehicleMake}
            onChange={handleInputChange}
            placeholder="Entrez la marque de votre véhicule"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vehicleName" className={styles.label}>
            Service du véhicule*
          </label>
          <select
            id="vehicleName"
            name="vehicleName"
            value={formData.vehicleName}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionnez un service</option>
            <option value="Taxi">Taxi</option>
            <option value="Livraison">Livraison</option>
            <option value="Personnel">Personnel</option>
            <option value="Transport public">Transport public</option>
            <option value="Location">Location</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vehicleRegistrationNumber" className={styles.label}>
            Immatriculation*
          </label>
          <input
            type="text"
            id="vehicleRegistrationNumber"
            name="vehicleRegistrationNumber"
            value={formData.vehicleRegistrationNumber}
            onChange={handleInputChange}
            placeholder="Le numéro d'immatriculation du véhicule"
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="vehicleType" className={styles.label}>
            Type de véhicule*
          </label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleInputChange}
            className={styles.select}
            required
          >
            <option value="">Sélectionnez un type</option>
            <option value="Voiture">Voiture</option>
            <option value="Camion">Camion</option>
            <option value="Bus">Bus</option>
            <option value="Bicyclette">Bicyclette</option>
            <option value="Moto">Moto</option>
            <option value="Tricycle">Tricycle</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="trackingDeviceId" className={styles.label}>
            Identifiant du dispositif de suivi*
          </label>
          <input
            type="text"
            id="trackingDeviceId"
            name="trackingDeviceId"
            value={formData.trackingDeviceId}
            onChange={handleInputChange}
            placeholder="Entrez le numéro d'identification du dispositif de suivi qui a été placé sur votre véhicule"
            className={styles.input}
            required
          />
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Bouton de soumission */}
        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}