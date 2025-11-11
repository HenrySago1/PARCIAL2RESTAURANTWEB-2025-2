// Archivo: app/src/admin/app.js
// (Versión Corregida con .jsx)

import { ChartPie } from '@strapi/icons';

export default {
  config: {
    locales: ['es'],
  },

  bootstrap(app) {
    // 1. Añadimos la página al menú
    app.addMenuLink({
      to: '/plugins/dashboard',
      icon: ChartPie,
      intlLabel: {
        id: 'dashboard.menu.title',
        defaultMessage: 'Dashboard',
      },
      async Component() {
        const component = await import(
          /* webpackChunkName: "dashboard-page" */ './pages/DashboardPage/index.jsx' // <-- ¡CAMBIO AQUÍ!
        );
        return component;
      },
    });
  },
};