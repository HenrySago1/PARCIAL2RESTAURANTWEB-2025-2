// Archivo: app/src/api/mesa/routes/custom-mesa-routes.js

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/mesas/disponibles', // La URL que llamaremos
      handler: 'mesa.disponibles', // Llama a la función "disponibles" en el controlador "mesa"
      config: {
        auth: false, // No requiere autenticación
      },
    },
  ],
};