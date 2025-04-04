module.exports = {
  beforeCreate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params } = event;

    const validateType = await strapi
      .service("api::menu-diario.menu-diario")
      .validateType(params);

    if (!validateType) {
      throw new ApplicationError("This plate is not in the correct type");
    }
  },

  afterCreate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params, result } = event;

    const isPublishing = params.data.publishedAt !== null;

    const connectOrSet = isPublishing ? "set" : "connect";

    try {
      const { sum_prices, priceWithIva } = await strapi
        .service("api::menu-diario.menu-diario")
        .sum_prices(
          params.data.First[connectOrSet].map((item) => item.id),
          params.data.Second[connectOrSet].map((item) => item.id),
          params.data.Dessert[connectOrSet].map((item) => item.id),
          params.data.Price
        );

      await strapi.db.query("api::menu-diario.menu-diario").update({
        where: { id: result.id },
        data: {
          Sum_Prices: sum_prices,
          Price_iva: priceWithIva,
        },
      });
    } catch (error) {
      console.error("Error on the afterCreate of menu", error);
      throw new ApplicationError("Error");
    }
  },

  beforeUpdate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params } = event;

    const validateType = await strapi
      .service("api::menu-diario.menu-diario")
      .validateType(params);

    if (!validateType) {
      throw new ApplicationError("This plate is not in the correct type");
    }
  },

  afterUpdate: async (event) => {
    const { errors } = require("@strapi/utils");
    const { ApplicationError } = errors;
    const { params } = event;

    try {
      console.log("params->", params);
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
    } catch (error) {
      console.error("Error on the afterUpdate of menu", error);
      throw new ApplicationError("Error");
    }
  },
};
