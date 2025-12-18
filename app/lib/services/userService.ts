// ============================================================================
// FICHIER: lib/services/userService.ts
// DESCRIPTION: Service pour gérer toutes les opérations API liées aux utilisateurs
// ============================================================================

/**
 * Ce service encapsule toutes les requêtes HTTP liées aux utilisateurs.
 * Il utilise l'instance axios configurée dans api.ts
 * 
 * Avantages de cette approche:
 * - Centralisation: Toutes les requêtes users au même endroit
 * - Réutilisabilité: Peut être appelé depuis n'importe quel composant
 * - Typage: TypeScript vérifie les types automatiquement
 * - Maintenance: Facile de modifier une requête pour tous les composants
 */

import api from '../api';
import {
  User,
  SafeUser,
  CreateUserDto,
  UpdateUserDto,
  LoginCredentials,
  AuthResponse,
  PaginatedResponse,
  PaginationParams,
} from '../../types';
import { AxiosResponse } from 'axios';

// ============================================================================
// 1. FONCTIONS CRUD DE BASE (Create, Read, Update, Delete)
// ============================================================================

/**
 * Récupérer tous les utilisateurs
 * 
 * @param params - Paramètres de pagination (optionnels)
 * @returns Promise avec la liste des utilisateurs (sans mots de passe)
 * 
 * Endpoint: GET /users
 * Exemple d'utilisation:
 * const users = await userService.getAllUsers();
 * const paginatedUsers = await userService.getAllUsers({ page: 0, size: 10 });
 */
export const getAllUsers = async (
  params?: PaginationParams
): Promise<SafeUser[]> => {
  try {
    // Effectue une requête GET vers /users
    // Les paramètres de pagination sont ajoutés à l'URL automatiquement
    // Exemple: /users?page=0&size=10
    const response: AxiosResponse<SafeUser[]> = await api.get('/users', {
      params, // params devient ?page=0&size=10 dans l'URL
    });

    // Retourne uniquement les données (response.data)
    // axios encapsule la réponse dans un objet AxiosResponse
    return response.data;
  } catch (error) {
    // L'erreur est déjà loggée par l'intercepteur dans api.ts
    // On la propage pour que le composant qui appelle puisse la gérer
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

/**
 * Récupérer tous les utilisateurs avec pagination
 * Version pour API Spring Boot qui retourne un objet Page
 * 
 * @param params - Paramètres de pagination
 * @returns Promise avec la réponse paginée
 * 
 * Endpoint: GET /users/paginated
 * Exemple d'utilisation:
 * const page = await userService.getAllUsersPaginated({ page: 0, size: 20 });
 * console.log(page.content); // Les utilisateurs
 * console.log(page.totalElements); // Nombre total
 */
export const getAllUsersPaginated = async (
  params: PaginationParams = { page: 0, size: 10 }
): Promise<PaginatedResponse<SafeUser>> => {
  try {
    const response: AxiosResponse<PaginatedResponse<SafeUser>> = await api.get(
      '/users/paginated',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération paginée des utilisateurs:', error);
    throw error;
  }
};

/**
 * Récupérer un utilisateur par son ID
 * 
 * @param userId - ID de l'utilisateur
 * @returns Promise avec l'utilisateur (sans mot de passe)
 * 
 * Endpoint: GET /users/:id
 * Exemple d'utilisation:
 * const user = await userService.getUserById(1);
 */
export const getUserById = async (userId: number): Promise<SafeUser> => {
  try {
    // Template string pour construire l'URL dynamiquement
    // Exemple: /users/1
    const response: AxiosResponse<SafeUser> = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
    throw error;
  }
};

/**
 * Récupérer un utilisateur par son email
 * 
 * @param email - Email de l'utilisateur
 * @returns Promise avec l'utilisateur (sans mot de passe)
 * 
 * Endpoint: GET /users/email/:email
 * Exemple d'utilisation:
 * const user = await userService.getUserByEmail('user@example.com');
 */
export const getUserByEmail = async (email: string): Promise<SafeUser> => {
  try {
    // encodeURIComponent encode l'email pour l'URL
    // Transforme "user@example.com" en "user%40example.com"
    const encodedEmail = encodeURIComponent(email);
    const response: AxiosResponse<SafeUser> = await api.get(
      `/users/email/${encodedEmail}`
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'utilisateur avec l'email ${email}:`, error);
    throw error;
  }
};

/**
 * Créer un nouvel utilisateur
 * 
 * @param userData - Données du nouvel utilisateur
 * @returns Promise avec l'utilisateur créé (sans mot de passe)
 * 
 * Endpoint: POST /users
 * Exemple d'utilisation:
 * const newUser = await userService.createUser({
 *   userName: "John Doe",
 *   userEmail: "john@example.com",
 *   userPassword: "securePassword123",
 *   userPhoneNumber: "+237600000000"
 * });
 */
export const createUser = async (
  userData: CreateUserDto
): Promise<SafeUser> => {
  try {
    // POST envoie les données dans le body de la requête
    // axios convertit automatiquement userData en JSON
    const response: AxiosResponse<SafeUser> = await api.post(
      '/users',
      userData // Deuxième paramètre = body de la requête
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

/**
 * Mettre à jour un utilisateur existant
 * 
 * @param userId - ID de l'utilisateur à modifier
 * @param userData - Données à mettre à jour (partiel)
 * @returns Promise avec l'utilisateur mis à jour (sans mot de passe)
 * 
 * Endpoint: PUT /users/:id
 * Exemple d'utilisation:
 * const updated = await userService.updateUser(1, {
 *   userName: "New Name"
 * });
 */
export const updateUser = async (
  userId: number,
  userData: UpdateUserDto
): Promise<SafeUser> => {
  try {
    // PUT pour une mise à jour complète
    // PATCH serait pour une mise à jour partielle (selon ton API)
    const response: AxiosResponse<SafeUser> = await api.put(
      `/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, error);
    throw error;
  }
};

/**
 * Mettre à jour partiellement un utilisateur (PATCH)
 * Alternative à updateUser pour des mises à jour partielles
 * 
 * @param userId - ID de l'utilisateur
 * @param userData - Champs à mettre à jour
 * @returns Promise avec l'utilisateur mis à jour
 * 
 * Endpoint: PATCH /users/:id
 */
export const patchUser = async (
  userId: number,
  userData: UpdateUserDto
): Promise<SafeUser> => {
  try {
    const response: AxiosResponse<SafeUser> = await api.patch(
      `/users/${userId}`,
      userData
    );
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour partielle de l'utilisateur ${userId}:`, error);
    throw error;
  }
};

/**
 * Supprimer un utilisateur
 * 
 * @param userId - ID de l'utilisateur à supprimer
 * @returns Promise<void>
 * 
 * Endpoint: DELETE /users/:id
 * Exemple d'utilisation:
 * await userService.deleteUser(1);
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    // DELETE ne retourne généralement pas de données
    // Juste un status code (200, 204, etc.)
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'utilisateur ${userId}:`, error);
    throw error;
  }
};

// ============================================================================
// 2. FONCTIONS D'AUTHENTIFICATION
// ============================================================================

/**
 * Connexion (login) d'un utilisateur
 * 
 * @param credentials - Email et mot de passe
 * @returns Promise avec les informations d'authentification (user + token)
 * 
 * Endpoint: POST /auth/login
 * Exemple d'utilisation:
 * const authData = await userService.login({
 *   userEmail: "user@example.com",
 *   userPassword: "password123"
 * });
 * // Stocker le token
 * localStorage.setItem('authToken', authData.token);
 */
export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      '/auth/login',
      credentials
    );

    // Si tu reçois un token, tu peux le stocker ici
    // Mais c'est mieux de le faire dans le composant pour plus de flexibilité
    // if (response.data.token) {
    //   localStorage.setItem('authToken', response.data.token);
    // }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

/**
 * Déconnexion (logout) d'un utilisateur
 * 
 * @returns Promise<void>
 * 
 * Endpoint: POST /auth/logout
 * Exemple d'utilisation:
 * await userService.logout();
 * localStorage.removeItem('authToken');
 */
export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
    // Supprimer le token du localStorage
    // (à faire dans le composant pour plus de contrôle)
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    throw error;
  }
};

/**
 * Inscription (register) d'un nouvel utilisateur
 * 
 * @param userData - Données du nouvel utilisateur
 * @returns Promise avec les informations d'authentification
 * 
 * Endpoint: POST /auth/register
 * Exemple d'utilisation:
 * const authData = await userService.register({
 *   userName: "New User",
 *   userEmail: "newuser@example.com",
 *   userPassword: "securePassword123",
 *   userPhoneNumber: "+237600000000"
 * });
 */
export const register = async (
  userData: CreateUserDto
): Promise<AuthResponse> => {
  try {
    const response: AxiosResponse<AuthResponse> = await api.post(
      '/auth/register',
      userData
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * 
 * @returns Promise avec l'utilisateur connecté
 * 
 * Endpoint: GET /auth/me
 * Exemple d'utilisation:
 * const currentUser = await userService.getCurrentUser();
 */
export const getCurrentUser = async (): Promise<SafeUser> => {
  try {
    // Cette requête nécessite un token d'authentification
    // Le token sera ajouté automatiquement par l'intercepteur
    // (quand tu l'implémenteras dans api.ts)
    const response: AxiosResponse<SafeUser> = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    throw error;
  }
};

/**
 * Changer le mot de passe d'un utilisateur
 * 
 * @param userId - ID de l'utilisateur
 * @param oldPassword - Ancien mot de passe
 * @param newPassword - Nouveau mot de passe
 * @returns Promise<void>
 * 
 * Endpoint: POST /users/:id/change-password
 * Exemple d'utilisation:
 * await userService.changePassword(1, "oldPass123", "newPass456");
 */
export const changePassword = async (
  userId: number,
  oldPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post(`/users/${userId}/change-password`, {
      oldPassword,
      newPassword,
    });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    throw error;
  }
};

/**
 * Demander une réinitialisation de mot de passe
 * 
 * @param email - Email de l'utilisateur
 * @returns Promise<void>
 * 
 * Endpoint: POST /auth/forgot-password
 * Exemple d'utilisation:
 * await userService.forgotPassword("user@example.com");
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Erreur lors de la demande de réinitialisation:', error);
    throw error;
  }
};

/**
 * Réinitialiser le mot de passe avec un token
 * 
 * @param token - Token de réinitialisation
 * @param newPassword - Nouveau mot de passe
 * @returns Promise<void>
 * 
 * Endpoint: POST /auth/reset-password
 * Exemple d'utilisation:
 * await userService.resetPassword("reset-token-123", "newPassword456");
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  try {
    await api.post('/auth/reset-password', {
      token,
      newPassword,
    });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation du mot de passe:', error);
    throw error;
  }
};

// ============================================================================
// 3. FONCTIONS DE RECHERCHE ET FILTRAGE
// ============================================================================

/**
 * Rechercher des utilisateurs par nom
 * 
 * @param searchTerm - Terme de recherche
 * @returns Promise avec la liste des utilisateurs correspondants
 * 
 * Endpoint: GET /users/search?q=...
 * Exemple d'utilisation:
 * const results = await userService.searchUsers("John");
 */
export const searchUsers = async (searchTerm: string): Promise<SafeUser[]> => {
  try {
    const response: AxiosResponse<SafeUser[]> = await api.get('/users/search', {
      params: { q: searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    throw error;
  }
};

/**
 * Compter le nombre total d'utilisateurs
 * 
 * @returns Promise avec le nombre d'utilisateurs
 * 
 * Endpoint: GET /users/count
 * Exemple d'utilisation:
 * const count = await userService.countUsers();
 */
export const countUsers = async (): Promise<number> => {
  try {
    const response: AxiosResponse<{ count: number }> = await api.get(
      '/users/count'
    );
    return response.data.count;
  } catch (error) {
    console.error('Erreur lors du comptage des utilisateurs:', error);
    throw error;
  }
};

// ============================================================================
// 4. EXPORT D'UN OBJET SERVICE COMPLET
// ============================================================================

/**
 * Objet userService qui regroupe toutes les fonctions
 * 
 * Avantage: Permet d'importer le service comme un objet
 * 
 * Utilisation:
 * import { userService } from '@/lib/services/userService';
 * const users = await userService.getAllUsers();
 * 
 * OU importer des fonctions individuelles:
 * import { getAllUsers, createUser } from '@/lib/services/userService';
 */
const userService = {
  // CRUD
  getAllUsers,
  getAllUsersPaginated,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  patchUser,
  deleteUser,

  // Authentification
  login,
  logout,
  register,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,

  // Recherche
  searchUsers,
  countUsers,
};

export default userService;

// ============================================================================
// EXEMPLES D'UTILISATION DANS UN COMPOSANT REACT
// ============================================================================

/**
 * EXEMPLE 1: Récupérer tous les utilisateurs dans un composant
 * 
 * import { userService } from '@/lib/services/userService';
 * import { useState, useEffect } from 'react';
 * 
 * function UserList() {
 *   const [users, setUsers] = useState([]);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 * 
 *   useEffect(() => {
 *     async function fetchUsers() {
 *       try {
 *         const data = await userService.getAllUsers();
 *         setUsers(data);
 *       } catch (err) {
 *         setError(err.message);
 *       } finally {
 *         setLoading(false);
 *       }
 *     }
 *     fetchUsers();
 *   }, []);
 * 
 *   if (loading) return <p>Chargement...</p>;
 *   if (error) return <p>Erreur: {error}</p>;
 * 
 *   return (
 *     <ul>
 *       {users.map(user => (
 *         <li key={user.userId}>{user.userName}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */

/**
 * EXEMPLE 2: Créer un utilisateur avec un formulaire
 * 
 * import { userService } from '@/lib/services/userService';
 * import { useState } from 'react';
 * 
 * function CreateUserForm() {
 *   const [formData, setFormData] = useState({
 *     userName: '',
 *     userEmail: '',
 *     userPassword: '',
 *     userPhoneNumber: ''
 *   });
 * 
 *   const handleSubmit = async (e) => {
 *     e.preventDefault();
 *     try {
 *       const newUser = await userService.createUser(formData);
 *       alert(`Utilisateur ${newUser.userName} créé avec succès!`);
 *     } catch (error) {
 *       alert('Erreur lors de la création');
 *     }
 *   };
 * 
 *   return (
 *     <form onSubmit={handleSubmit}>
 *       <input
 *         value={formData.userName}
 *         onChange={(e) => setFormData({...formData, userName: e.target.value})}
 *         placeholder="Nom"
 *       />
 *       // ... autres champs
 *       <button type="submit">Créer</button>
 *     </form>
 *   );
 * }
 */

/**
 * EXEMPLE 3: Login
 * 
 * import { userService } from '@/lib/services/userService';
 * 
 * async function handleLogin(email, password) {
 *   try {
 *     const authData = await userService.login({
 *       userEmail: email,
 *       userPassword: password
 *     });
 *     
 *     // Stocker le token
 *     if (authData.token) {
 *       localStorage.setItem('authToken', authData.token);
 *     }
 *     
 *     // Rediriger vers le dashboard
 *     router.push('/dashboard');
 *   } catch (error) {
 *     alert('Email ou mot de passe incorrect');
 *   }
 * }
 */