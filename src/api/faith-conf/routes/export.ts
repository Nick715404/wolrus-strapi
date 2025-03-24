module.exports = {
  routes: [
    {
      method: "GET",
      path: "/faith-conf/export",
      handler: "export.exportExcel",
    },
  ],
};
