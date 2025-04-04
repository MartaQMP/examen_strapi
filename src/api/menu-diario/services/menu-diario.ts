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
      if (!firstPlate) {
        return { error: `Plate with id ${firstPlate} not found.` };
      }

      const secondPlate = await strapi.db.query("api::plato.plato").findOne({
        where: {
          id: idSecond,
        },
      });
      if (!secondPlate) {
        return { error: `Plate with id ${secondPlate} not found.` };
      }

      const dessert = await strapi.db.query("api::plato.plato").findOne({
        where: {
          id: idDessert,
        },
      });
      if (!dessert) {
        return { error: `Plate with id ${dessert} not found.` };
      }

      const priceWithIva = priceMenu * 1.21;

      const sum_prices = firstPlate.Price + secondPlate.Price + dessert.Price;
      return { sum_prices, priceWithIva };
    },

    async validateType(params) {
      const checkPlateType = async (plateData, expectedType) => {
        if (
          plateData &&
          Array.isArray(plateData.connect) &&
          plateData.connect.length > 0
        ) {
          const plate = await strapi.db.query("api::plato.plato").findOne({
            where: { id: plateData.connect.map((item) => item.id) },
          });

          return plate.Type === expectedType;
        }
        return true;
      };

      const isValidFirst = await checkPlateType(params.data.First, "First");
      if (!isValidFirst) return false;

      const isValidSecond = await checkPlateType(params.data.Second, "Second");
      if (!isValidSecond) return false;

      const isValidDessert = await checkPlateType(
        params.data.Dessert,
        "Dessert"
      );
      if (!isValidDessert) return false;
    },
  })
);
