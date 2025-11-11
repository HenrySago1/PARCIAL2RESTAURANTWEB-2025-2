// Archivo: app/src/config/middlewares.js

module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // ESTA LÍNEA ES LA SOLUCIÓN
          'connect-src': ["'self'", 'https:', 'http://localhost:8000'],

          // (Estas son necesarias para los gráficos)
          'script-src': ["'self'", "'unsafe-inline'", 'blob:'],
          'img-src': ["'self'", 'data:', 'blob:'],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];