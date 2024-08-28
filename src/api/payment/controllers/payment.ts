/**
 * A set of functions called "actions" for `payment`
 */

export default {
  exampleAction: async (ctx, next) => {
    try {
      return "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
};
