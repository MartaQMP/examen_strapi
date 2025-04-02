module.exports = {
  afterCreate: async (event) => {
    const { params, result } = event;

    if (params.data) {
      const sum_precios = await strapi
        .service("api::menu-diario.menu-diario")
        .sum_precio(
          params.data.Primero.connect.map((item) => item.id),
          params.data.Segundo.connect.map((item) => item.id),
          params.data.Postre.connect.map((item) => item.id)
        );
      await strapi.db.query("api::menu-diario.menu-diario").update({
        where: { id: result.id },
        data: {
          Sum_Precio: sum_precios,
        },
      });
    }
  },

  afterUpdate: async (event) => {
    const { params } = event;

    if (params.data) {
      const sum_precios = await strapi
        .service("api::menu-diario.menu-diario")
        .sum_precio(
          params.data.Primero.connect.map((item) => item.id),
          params.data.Segundo.connect.map((item) => item.id),
          params.data.Postre.connect.map((item) => item.id)
        );
      await strapi.db.query("api::menu-diario.menu-diario").update({
        where: { id: params.where.id },
        data: {
          Sum_Precio: sum_precios,
        },
      });
    }
  },
};
