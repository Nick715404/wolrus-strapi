import { factories } from "@strapi/strapi";
import { TFormData, TPaymentStatus } from "../content-types/order.types";
import {
  getDonationPayment,
  getPayment,
  getPeymentStatus,
} from "../../../utils/payments";
import { emailsPipe } from "../../../utils/emails";
import { airtablePipe } from "../../../utils/airtable";

export default factories.createCoreController(
  "api::order.order",
  ({ strapi }) => ({
    async payment(ctx) {
      const frontData = ctx.request.body as TFormData;
      try {
      } catch (error) {
        console.error("Payment creation error:", error);
        ctx.throw(400, error);
      }
    },
    async paymentStatus(ctx) {
      const paymentData = ctx.request.body as TPaymentStatus;

      try {
        
      } catch (error) {
        console.error("Payment capture error:", error);
        ctx.throw(400, error);
      }
    },
    async donationPayment(ctx) {
      const data = ctx.request.body;

      try {
      } catch (error) {
        console.error("Payment creation error:", error);
        ctx.throw(400, error);
      }
    },
  })
);
