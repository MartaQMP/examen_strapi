export default {
  routes: [
    {
      method: "POST",
      path: "/menu-without",
      handler: "menu-diario.menuWithout",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/popular-plates",
      handler: "menu-diario.popularPlates",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
