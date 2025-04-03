/**
 * menu-diario service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::menu-diario.menu-diario",
  ({ strapi }) => ({
    async sum_prices(idFirst, idSecond, idDessert, priceMenu) {
      const firstPlate = await strapi.db.query("api::plato.plato").findOne({
        where: {
          id: idFirst,
        },
      });

      const secondPlate = await strapi.db.query("api::plato.plato").findOne({
        where: {
          id: idSecond,
        },
      });

      const dessert = await strapi.db.query("api::plato.plato").findOne({
        where: {
          id: idDessert,
        },
      });

      const priceWithIva = priceMenu * 1.21;

      const sum_prices = firstPlate.Price + secondPlate.Price + dessert.Price;
      return { sum_prices, priceWithIva };
    },

    async validateType(params) {
      if (
        params.data.First &&
        Array.isArray(params.data.First.connect) &&
        params.data.First.connect.length > 0
      ) {
        const firstPlate = await strapi.db.query("api::plato.plato").findOne({
          where: { id: params.data.First.connect.map((item) => item.id) },
        });

        if (firstPlate.Type !== "First") {
          return false;
        }
      }

      if (
        params.data.Second &&
        Array.isArray(params.data.Second.connect) &&
        params.data.Second.connect.length > 0
      ) {
        const secondPlate = await strapi.db.query("api::plato.plato").findOne({
          where: { id: params.data.Second.connect.map((item) => item.id) },
        });

        if (secondPlate.Type !== "Second") {
          return false;
        }
      }

      if (
        params.data.Dessert &&
        Array.isArray(params.data.Dessert.connect) &&
        params.data.Dessert.connect.length > 0
      ) {
        const dessertPlate = await strapi.db.query("api::plato.plato").findOne({
          where: { id: params.data.Dessert.connect.map((item) => item.id) },
        });

        if (dessertPlate.Type !== "Dessert") {
          return false;
        }
      }
      return true;
    },
  })
);
