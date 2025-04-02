import type { Schema, Struct } from '@strapi/strapi';

export interface AlergenosAlergenos extends Struct.ComponentSchema {
  collectionName: 'components_alergenos_alergenos';
  info: {
    description: '';
    displayName: 'Alergenos';
    icon: 'cup';
  };
  attributes: {
    Descripcion: Schema.Attribute.Text;
    Icono: Schema.Attribute.Media<'images', true>;
    Nombre: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'alergenos.alergenos': AlergenosAlergenos;
    }
  }
}
