

module.exports = {
  /**
   * Esta función se dispara automáticamente DESPUÉS de que se crea un nuevo Pedido.
   * Su trabajo es descontar el stock de los insumos.
   */
  async afterCreate(event) {
    const { result, params } = event; // Obtenemos los "params" (lo que se envió)
    const pedidoId = result.id;
    
    // 1. Obtenemos la lista de IDs de platillos de los datos enviados
    const { platillos } = params.data; 

    // platillos será un array de IDs, ej: [1, 3]

    if (!platillos || platillos.length === 0) {
      console.log(`[Stock] Pedido #${pedidoId} se creó sin platillos. No se descuenta nada.`);
      return;
    }

    console.log(`[Stock] Nuevo Pedido #${pedidoId} creado. Procesando ${platillos.length} platillos...`);

    try {
      // 2. Buscamos las recetas de esos platillos.
      // ¡Usamos strapi.db.query para saltarnos los permisos del rol "Mesero"
      // y poder leer los Insumos!
      
      const platillosConReceta = await strapi.db.query('api::platillo.platillo').findMany({
        where: {
          id: { $in: platillos } // Busca todos los platillos cuyos IDs estén en nuestra lista
        },
        populate: {
          receta: {
            populate: {
              insumo: true, // Popula el insumo de la receta
            },
          },
        },
      });

      // 3. Iteramos por cada platillo y descontamos el stock
      for (const platillo of platillosConReceta) {
        
        if (!platillo.receta || platillo.receta.length === 0) {
          console.warn(`[Stock] Platillo "${platillo.nombre}" (ID: ${platillo.id}) no tiene receta definida. Saltando.`);
          continue;
        }

        // 4. Iteramos por cada ingrediente (insumo/cantidad) en la receta
        for (const ingrediente of platillo.receta) {
          
          if (!ingrediente.insumo || !ingrediente.cantidad) {
            console.warn(`[Stock] Ingrediente en platillo "${platillo.nombre}" está mal configurado.`);
            continue;
          }

          const insumo = ingrediente.insumo;
          const cantidadUsada = ingrediente.cantidad;
          
          const stockActual = insumo.stock_actual || 0;
          const nuevoStock = stockActual - cantidadUsada;

          // 5. Actualizamos el Insumo usando strapi.db.query
          await strapi.db.query('api::insumo.insumo').update({
            where: { id: insumo.id },
            data: {
              stock_actual: nuevoStock,
            },
          });

          console.log(`[Stock] Descontado: ${cantidadUsada} de "${insumo.nombre}". Stock restante: ${nuevoStock}`);
        }
      }

    } catch (err) {
      console.error(`[Stock] Error al descontar stock para el Pedido #${pedidoId}:`, err);
    }
  },
};