// ============================================================================
// FICHIER: types/common.ts
// DESCRIPTION: Types communs utilisés dans toute l'application
// ============================================================================

/**
 * Type pour les coordonnées géographiques [longitude, latitude]
 * Format utilisé par PostGIS et GeoJSON
 * 
 * Exemple: [3.8480, 11.5021] pour Yaoundé
 */
export type Coordinates = [number, number];

/**
 * Type GeoJSON Point
 * C'est le format que Spring Boot retournera pour les colonnes GEOMETRY(Point, 4326)
 * 
 * PostGIS stocke les géométries en format binaire, mais les retourne en GeoJSON
 * 
 * Exemple:
 * {
 *   type: "Point",
 *   coordinates: [3.8480, 11.5021]
 * }
 */
export interface GeoJSONPoint {
  type: 'Point';
  coordinates: Coordinates;
}

/**
 * Type GeoJSON LineString
 * Utilisé pour l'historique des positions (summaryCoordinate dans positionHistory)
 * 
 * Un LineString est une série de points qui forment une ligne
 * 
 * Exemple:
 * {
 *   type: "LineString",
 *   coordinates: [
 *     [3.8480, 11.5021],
 *     [3.8490, 11.5031],
 *     [3.8500, 11.5041]
 *   ]
 * }
 */
export interface GeoJSONLineString {
  type: 'LineString';
  coordinates: Coordinates[];
}

/**
 * Type union pour toutes les géométries supportées
 */
export type Geometry = GeoJSONPoint | GeoJSONLineString;

/**
 * Type pour les timestamps
 * Les dates viennent de l'API en format ISO string
 * Exemple: "2024-01-15T10:30:00Z"
 */
export type ISODateString = string;

/**
 * Type générique pour les réponses paginées de l'API
 * Si ton API Spring Boot implémente la pagination
 * 
 * Exemple de réponse paginée:
 * {
 *   content: [...], // Les données
 *   totalElements: 100,
 *   totalPages: 10,
 *   size: 10,
 *   number: 0,
 *   first: true,
 *   last: false
 * }
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * Type pour les paramètres de pagination
 * Utilisé dans les requêtes GET avec pagination
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * Type générique pour les erreurs API
 * Structure typique des erreurs retournées par Spring Boot
 */
export interface ApiError {
  timestamp: ISODateString;
  status: number;
  error: string;
  message: string;
  path: string;
}

/**
 * Type pour les réponses de succès génériques
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}