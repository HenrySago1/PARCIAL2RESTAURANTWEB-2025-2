import type { Attribute, Schema } from '@strapi/strapi';

export interface RecetasIngredienteReceta extends Schema.Component {
  collectionName: 'components_recetas_ingrediente_recetas';
  info: {
    displayName: 'IngredienteReceta';
    icon: 'shoppingCart';
  };
  attributes: {
    cantidad: Attribute.Decimal;
    insumos: Attribute.Relation<
      'recetas.ingrediente-receta',
      'oneToMany',
      'api::insumo.insumo'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'recetas.ingrediente-receta': RecetasIngredienteReceta;
    }
  }
}
