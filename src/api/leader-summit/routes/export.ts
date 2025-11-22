module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/leader-summit/export',
      handler: 'export.exportExcel',
    },
  ],
};
