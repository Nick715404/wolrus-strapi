export default {
  routes: [
    {
     method: 'POST',
     path: '/contacts',
     handler: 'contacts.sendMail',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
