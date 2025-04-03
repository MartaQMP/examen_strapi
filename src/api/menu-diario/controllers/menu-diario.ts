/**
 * menu-diario controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::menu-diario.menu-diario",
  () => ({
    async menuWithout(ctx) {
      const { allergens } = ctx.request.body;

      const platos = await strapi.documents("api::plato.plato").findMany({
        populate: {
          Allergens: true,
        },
      });

      const platosConAlergenos = platos.filter((plato) => {
        return plato.Allergens.some((alergeno) =>
          allergens.includes(alergeno.Name)
        );
      });

      const menus = await strapi
        .documents("api::menu-diario.menu-diario")
        .findMany({ populate: { First: true, Second: true, Dessert: true } });

      const menusSinPlatosConAlergenos = menus.filter((menu) => {
        const platosEnMenu = [menu.First, menu.Second, menu.Dessert];

        return !platosEnMenu.some((plato) => {
          if (!plato) return false;

          return platosConAlergenos.some(
            (platoConAlergeno) => platoConAlergeno.id === plato.id
          );
        });
      });

      return ctx.send(platosConAlergenos);
    },
    async popularPlates(ctx) {
      const menuPlates = await strapi
        .documents("api::menu-diario.menu-diario")
        .findMany({
          populate: {
            First: true,
            Second: true,
            Dessert: true,
          },
        });

      const plates = await strapi.documents("api::plato.plato").findMany({});

      menuPlates.forEach((menu) => {});
      console.log("menuPlates->", menuPlates);
      return ctx.send(plates);
    },
  })
);
