// Archivo: app/src/api/reporte/routes/reporte.js

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/reportes/platos-mas-vendidos',
      handler: 'reporte.platosMasVendidos',
      config: {
        auth: false, // Por ahora lo dejamos público
      },
    },
  ],
};