export default {
  routes: [
    {
      method: "POST",
      path: "/contacts/submit-form",
      handler: "contacts.submitForm",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
