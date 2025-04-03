module.exports = {
  afterUpdate: async (event) => {
    const { params } = event;

    const typeMap = {
      First: "First",
      Second: "Second",
      Dessert: "Dessert",
    };

    const selectedType = typeMap[params.data.Type];

    if (selectedType) {
      const updateMenus = await strapi.db
        .query("api::menu-diario.menu-diario")
        .findMany({
          where: {
            [selectedType]: {
              id: params.where.id,
            },
          },
          populate: {
            First: true,
            Second: true,
            Dessert: true,
          },
        });
      console.log("menus->", updateMenus);

      for (const menu of updateMenus) {
        const { sum_prices, priceWithIva } = await strapi
          .service("api::menu-diario.menu-diario")
          .sum_prices(
            menu.First.id,
            menu.Second.id,
            menu.Dessert.id,
            menu.Price
          );

        await strapi.db.query("api::menu-diario.menu-diario").update({
          where: { id: menu.id },
          data: {
            Sum_Prices: sum_prices,
            Price_iva: priceWithIva,
          },
        });
      }
    }
  },
};
