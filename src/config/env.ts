export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000',
  /**
   * Base pública para servir imágenes subidas (transportes, etc.).
   * El backend guarda la imagen como una *clave* de storage
   * (ej. "transportes/2025/AXG-34-2-abc.jpg"); esta base la convierte en URL.
   * Por defecto cuelga de la API bajo /files (formato del contrato).
   */
  imagesBaseUrl:
    import.meta.env.VITE_IMAGES_BASE_URL ??
    `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'}/files`,
} as const
