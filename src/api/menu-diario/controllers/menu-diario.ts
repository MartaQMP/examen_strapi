/**
 * menu-diario controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::menu-diario.menu-diario",
  () => ({
    async menuWithout(ctx) {
      try {
        const { allergens } = ctx.request.body || {};
        if (!allergens) {
          return ctx.badRequest("You have to put allergens in the body");
        }

        const plates = await strapi.documents("api::plato.plato").findMany({
          populate: {
            Allergens: true,
          },
        });

        if (!plates) {
          return ctx.notFound(`Plates not found`);
        }

        const platesWithAllergens = plates.filter((plate) => {
          return plate.Allergens.some((allergen) =>
            allergens.includes(allergen.Name)
          );
        });

        const menus = await strapi
          .documents("api::menu-diario.menu-diario")
          .findMany({ populate: { First: true, Second: true, Dessert: true } });

        if (!menus) {
          return ctx.notFound("Menus not found");
        }

        const menusWithoutAllergens = menus.filter((menu) => {
          const withAllergens = [menu.First, menu.Second, menu.Dessert].some(
            (plate) => {
              return platesWithAllergens.some(
                (plateWithAllergens) => plateWithAllergens.id === plate.id
              );
            }
          );
          return !withAllergens;
        });

        return ctx.send(menusWithoutAllergens);
      } catch (error) {
        ctx.badRequest("Error");
      }
    },

    async popularPlates(ctx) {
      try {
        const menus = await strapi
          .documents("api::menu-diario.menu-diario")
          .findMany({
            populate: {
              First: true,
              Second: true,
              Dessert: true,
            },
          });

        if (!menus) {
          return ctx.notFound("Menus not found");
        }

        const plateCount = {};

        menus.forEach((menu) => {
          [menu.First, menu.Second, menu.Dessert].forEach((plate) => {
            if (plate.id) {
              plateCount[plate.id] = (plateCount[plate.id] || 0) + 1;
            }
          });
        });
        const popularPlatesIdOrder = Object.keys(plateCount).sort(
          (a, b) => plateCount[b] - plateCount[a]
        );

        const popularPlatesOrder = await strapi
          .documents("api::plato.plato")
          .findMany({
            where: { id: popularPlatesIdOrder },
            populate: { Allergens: true },
          });

        if (!popularPlatesOrder) {
          return ctx.notFound("Popular plates not found");
        }

        const orderedPlates = popularPlatesIdOrder.map((id) =>
          popularPlatesOrder.find((plate) => plate.id === Number(id))
        );

        const firstPlate = orderedPlates.find(
          (plate) => plate.Type === "First"
        );
        const secondPlate = orderedPlates.find(
          (plate) => plate.Type === "Second"
        );
        const dessertPlate = orderedPlates.find(
          (plate) => plate.Type === "Dessert"
        );

        const selectedPlates = [firstPlate, secondPlate, dessertPlate];

        return selectedPlates;
      } catch (error) {
        ctx.badRequest("Error");
      }
    },
  })
);
