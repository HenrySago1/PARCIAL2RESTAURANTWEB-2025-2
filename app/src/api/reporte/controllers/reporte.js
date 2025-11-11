// Archivo: app/src/api/reporte/controllers/reporte.js

module.exports = {

  // Esta es nuestra función de KPI
  async platosMasVendidos(ctx) {
    try {
      // 1. Buscamos todos los pedidos que tengan platillos
      const pedidos = await strapi.entityService.findMany('api::pedido.pedido', {
        populate: { platillos: true }, // ¡Importante! Incluir los platillos de cada pedido
      });

      // 2. Lógica para contar los platos
      const conteoDePlatos = {};

      // Recorremos cada pedido
      for (const pedido of pedidos) {
        // Recorremos cada platillo DENTRO de ese pedido
        if (pedido.platillos) {
          for (const platillo of pedido.platillos) {
            const nombrePlato = platillo.nombre || 'Plato Desconocido';

            // Si ya lo contamos antes, le sumamos 1. Si no, empezamos en 1.
            conteoDePlatos[nombrePlato] = (conteoDePlatos[nombrePlato] || 0) + 1;
          }
        }
      }

      // 3. Formatear el resultado (para que sea un reporte bonito)
      const reporte = Object.keys(conteoDePlatos).map(nombre => {
        return {
          plato: nombre,
          ventas: conteoDePlatos[nombre],
        };
      });

      // 4. Ordenar de más vendido a menos vendido
      reporte.sort((a, b) => b.ventas - a.ventas);

      // 5. Devolver el reporte
      return { data: reporte };

    } catch (err) {
      ctx.internalServerError('Error al generar el reporte de platos', err);
    }
  }
};