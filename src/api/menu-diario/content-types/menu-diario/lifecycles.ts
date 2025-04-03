module.exports = {
  beforeCreate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params } = event;

    const validateType = await strapi
      .service("api::menu-diario.menu-diario")
      .validateType(params);

    if (!validateType) {
      throw new ApplicationError("Este plato no es del tipo correcto");
    }
  },

  afterCreate: async (event) => {
    const { params, result } = event;

    const { sum_prices, priceWithIva } = await strapi
      .service("api::menu-diario.menu-diario")
      .sum_prices(
        params.data.First.connect.map((item) => item.id),
        params.data.Second.connect.map((item) => item.id),
        params.data.Dessert.connect.map((item) => item.id),
        params.data.Price
      );

    await strapi.db.query("api::menu-diario.menu-diario").update({
      where: { id: result.id },
      data: {
        Sum_Prices: sum_prices,
        Price_iva: priceWithIva,
      },
    });
  },

  beforeUpdate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params } = event;

    const validateType = await strapi
      .service("api::menu-diario.menu-diario")
      .validateType(params);

    if (!validateType) {
      throw new ApplicationError("Este plato no es del tipo correcto");
    }
  },

  afterUpdate: async (event) => {
    const { params } = event;

    const menuUpdate = await strapi.db
      .query("api::menu-diario.menu-diario")
      .findOne({
        where: { id: params.where.id },
        populate: { First: true, Second: true, Dessert: true },
      });

    const { sum_prices, priceWithIva } = await strapi
      .service("api::menu-diario.menu-diario")
      .sum_prices(
        menuUpdate.First.id,
        menuUpdate.Second.id,
        menuUpdate.Dessert.id,
        params.data.Price
      );

    if (sum_prices === menuUpdate.Sum_Prices) {
      return;
    }

    const update = await strapi.db
      .query("api::menu-diario.menu-diario")
      .update({
        where: { id: params.where.id },
        data: {
          Sum_Prices: sum_prices,
          Price_iva: priceWithIva,
        },
      });
  },
};
