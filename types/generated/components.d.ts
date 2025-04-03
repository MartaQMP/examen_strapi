import type { Schema, Struct } from '@strapi/strapi';

export interface AlergenosAlergenos extends Struct.ComponentSchema {
  collectionName: 'components_alergenos_alergenos';
  info: {
    description: '';
    displayName: 'Allergens';
    icon: 'cup';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<'images', true>;
    Name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'alergenos.alergenos': AlergenosAlergenos;
    }
  }
}
