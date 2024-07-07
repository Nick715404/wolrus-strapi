export default {
  routes: [
    {
      method: 'POST',
      path: '/orders/payment',
      handler: 'order.payment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/payment/status',
      handler: 'order.paymentStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/orders/donation',
      handler: 'order.donationPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
