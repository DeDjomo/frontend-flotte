// ============================================================================
// FICHIER: types/user.ts
// DESCRIPTION: Types TypeScript pour l'entité User
// ============================================================================

import { ISODateString } from './common';

/**
 * Interface User - Représente un utilisateur du système
 * Correspond à la table "user" dans PostgreSQL
 * 
 * Table SQL:
 * CREATE TABLE "user" (
 *   userId SERIAL PRIMARY KEY,
 *   userName VARCHAR(100) NOT NULL,
 *   userPassword VARCHAR(255) NOT NULL,
 *   userEmail VARCHAR(150) NOT NULL UNIQUE,
 *   userPhoneNumber VARCHAR(20) NOT NULL,
 *   createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *   updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
 * );
 */
export interface User {
  /** ID unique de l'utilisateur (auto-incrémenté) */
  userId: number;
  
  /** Nom de l'utilisateur */
  userName: string;
  
  /** 
   * Mot de passe hashé (bcrypt/argon2)
   * Note: En général, on ne reçoit PAS ce champ depuis l'API pour des raisons de sécurité
   * Il est seulement utilisé lors de la création/modification
   */
  userPassword?: string;
  
  /** Email de l'utilisateur (unique) */
  userEmail: string;
  
  /** Numéro de téléphone */
  userPhoneNumber: string;
  
  /** Date de création du compte */
  createdAt: ISODateString;
  
  /** Date de dernière modification */
  updatedAt: ISODateString;
}

/**
 * Type pour la création d'un nouvel utilisateur
 * Exclut les champs auto-générés (userId, createdAt, updatedAt)
 * 
 * Utilisation: Pour les requêtes POST /users
 */
export interface CreateUserDto {
  userName: string;
  userPassword: string;
  userEmail: string;
  userPhoneNumber: string;
}

/**
 * Type pour la mise à jour d'un utilisateur
 * Tous les champs sont optionnels (mise à jour partielle)
 * Le mot de passe est optionnel car on ne le change pas à chaque fois
 * 
 * Utilisation: Pour les requêtes PUT/PATCH /users/:id
 */
export interface UpdateUserDto {
  userName?: string;
  userPassword?: string;
  userEmail?: string;
  userPhoneNumber?: string;
}

/**
 * Type pour les informations de connexion
 * Utilisé lors de l'authentification
 */
export interface LoginCredentials {
  userEmail: string;
  userPassword: string;
}

/**
 * Type pour la réponse d'authentification
 * Retourné après un login réussi
 */
export interface AuthResponse {
  user: Omit<User, 'userPassword'>; // User sans le mot de passe
  token?: string; // JWT token (quand tu implémenteras l'auth)
  expiresIn?: number; // Durée de validité du token en secondes
}

/**
 * Type pour un utilisateur sans mot de passe
 * Utilisé pour l'affichage, car on ne veut jamais exposer le mot de passe
 */
export type SafeUser = Omit<User, 'userPassword'>;