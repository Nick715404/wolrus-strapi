module.exports = {
  routes: [
    {
      method: "GET",
      path: "/biznes-konferencziya/export",
      handler: "export.exportExcel",
    },
  ],
};
