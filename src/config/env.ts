/**
 * Punto unico para leer variables de entorno (import.meta.env).
 * Definir VITE_API_BASE_URL en un archivo .env (ver .env.example).
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
} as const
