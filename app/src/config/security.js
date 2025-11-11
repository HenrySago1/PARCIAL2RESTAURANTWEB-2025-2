// Archivo: app/src/config/security.js
// (Versión con useDefaults: false - La Definitiva)

module.exports = {
  contentSecurityPolicy: {
    // 1. ¡EL CAMBIO CLAVE!
    // Le decimos que NO use los defaults.
    useDefaults: false, 

    // 2. Definimos la política COMPLETA desde cero
    directives: {
      'connect-src': [
        "'self'", 
        'https:', 
        'http://localhost:8000' // <-- ¡NUESTRO PERMISO!
      ],
      'script-src': [
        "'self'", 
        "'unsafe-inline'", // Necesario para el panel de admin
        'blob:'
      ],
      'img-src': [
        "'self'", 
        'data:', 
        'blob:', 
        'market-assets.strapi.io', 
        'res.cloudinary.com'
      ],
      'media-src': ["'self'", 'data:', 'blob:'],
      'style-src': [
        "'self'", 
        "'unsafe-inline'", // Necesario para el panel de admin
        'fonts.googleapis.com'
      ],
      'font-src': ["'self'", 'fonts.gstatic.com'],
      'frame-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'block-all-mixed-content': [],
      'frame-ancestors': ["'self'"],
      'object-src': ["'none'"],
      'script-src-attr': ["'none'"],
      'upgrade-insecure-requests': [],
    },
  },
};