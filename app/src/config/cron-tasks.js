// Archivo: app/src/config/cron-tasks.js

module.exports = {
  /**
   * Tarea para cancelar reservas vencidas.
   * Se ejecuta cada 5 minutos.
   */
  '*/5 * * * *': async ({ strapi }) => {
    try {
      // 1. Obtener la hora actual MENOS 1 hora (la regla de tu proyecto)
      const unaHoraAtras = new Date(new Date().getTime() - (60 * 60 * 1000));

      // 2. Buscar todas las reservas que siguen "Pendiente" Y
      //    cuya fecha de reserva ya pasó (es más antigua que "hace una hora")
      const reservasVencidas = await strapi.entityService.findMany(
        'api::reserva.reserva',
        {
          filters: {
            estado: { $eq: 'Pendiente' },
            fecha_hora: { $lt: unaHoraAtras.toISOString() },
          },
        }
      );

      if (reservasVencidas.length > 0) {
        console.log(`[CronJob] Encontradas ${reservasVencidas.length} reservas vencidas. Actualizando...`);

        // 3. Recorrer cada reserva vencida y actualizar su estado a "Vencida"
        for (const reserva of reservasVencidas) {
          await strapi.entityService.update('api::reserva.reserva', reserva.id, {
            data: {
              estado: 'Vencida',
            },
          });
        }
      } else {
        console.log('[CronJob] No se encontraron reservas vencidas. Todo en orden.');
      }

    } catch (err) {
      console.error('Error en el Cron Job de reservas:', err);
    }
  },
};