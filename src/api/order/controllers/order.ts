import { factories } from '@strapi/strapi';
import { TPaymentBody, TPaymentStatus } from '../content-types/order.types';
import { sendTelegramMessage } from '../../../utils/email.utils';
import { getDonationPayment, getPayment, getPeymentStatus } from '../../../utils/payments';
import { emailsPipe } from '../../../utils/emails';

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async payment(ctx) {
    const frontData = ctx.request.body as TPaymentBody;
    try {
      const payment = await getPayment(frontData);
      return payment.confirmation.confirmation_url as string;
    } catch (error) {
      console.error('Payment creation error:', error);
      ctx.throw(400, error);
    }
  },
  async paymentStatus(ctx) {
    const paymentData = ctx.request.body as TPaymentStatus;

    if (paymentData.event !== 'payment.waiting_for_capture') return;

    try {
      const payment = await getPeymentStatus(paymentData.object.id);
      if (paymentData.object.metadata.isDonation === 'false') {
        await sendTelegramMessage(paymentData);
        await emailsPipe(paymentData);
      }

      return payment.status;
    } catch (error) {
      console.error('Payment capture error:', error);
      ctx.throw(400, error);
    }
  },
  async donationPayment(ctx) {
    const data = ctx.request.body;

    try {
      const payment = await getDonationPayment(data.price);
      return payment.confirmation.confirmation_url as string;
    } catch (error) {
      console.error('Payment creation error:', error);
      ctx.throw(400, error);
    }
  },
}));
