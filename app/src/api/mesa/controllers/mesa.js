// Archivo: app/src/api/mesa/controllers/mesa.js

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mesa.mesa', ({ strapi }) => ({

  // Esta es nuestra nueva función personalizada
  async disponibles(ctx) {

    // 1. Obtener la fecha y hora de la URL (ej: ?fecha_hora=...)
    const { fecha_hora } = ctx.query;

    if (!fecha_hora) {
      return ctx.badRequest('Falta el parámetro "fecha_hora"');
    }

    try {
      // 2. Definir el rango de la reserva (asumiremos 2 horas)
      const inicioSolicitado = new Date(fecha_hora);

      // Calculamos 2 horas ANTES y 2 horas DESPUÉS
      // Esto es una lógica simple para encontrar conflictos en un rango de 4 horas
      // (Una reserva a las 7pm chocaría con una petición a las 8pm)
      const rangoInicio = new Date(inicioSolicitado.getTime() - (1 * 60 * 60 * 1000));
      const rangoFin = new Date(inicioSolicitado.getTime() + (1 * 60 * 60 * 1000));

      // 3. Buscar todas las reservas que caen DENTRO de ese rango de tiempo
      const reservasConflictivas = await strapi.entityService.findMany('api::reserva.reserva', {
        filters: {
          fecha_hora: {
            $gte: rangoInicio.toISOString(),
            $lt: rangoFin.toISOString(),
          },
        },
        populate: { mesa: true }, // ¡Importante! Incluir la mesa de esa reserva
      });

      // 4. Obtener los IDs de las mesas que SÍ están ocupadas
      const idsMesasOcupadas = reservasConflictivas
        .filter(reserva => reserva.mesa) // Filtrar por si alguna reserva no tiene mesa
        .map(reserva => reserva.mesa.id);

      // 5. Buscar TODAS las mesas, EXCLUYENDO las que encontramos
      const mesasDisponibles = await strapi.entityService.findMany('api::mesa.mesa', {
        filters: {
          id: {
            $notIn: idsMesasOcupadas, // Excluir las IDs ocupadas
          },
        },
      });

      // 6. Devolver la lista de mesas libres
      return this.transformResponse(mesasDisponibles);

    } catch (err) {
      ctx.internalServerError('Error al buscar mesas disponibles', err);
    }
  }
}));