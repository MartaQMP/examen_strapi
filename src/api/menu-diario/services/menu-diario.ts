/**
 * menu-diario service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::menu-diario.menu-diario",
  ({ strapi }) => ({
    async sum_precio(idFirst, idSecond, idDessert) {
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

      const sum_precios =
        firstPlate.Precio + secondPlate.Precio + dessert.Precio;
      return sum_precios;
    },
  })
);
