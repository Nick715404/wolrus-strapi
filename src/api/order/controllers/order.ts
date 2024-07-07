import { factories } from '@strapi/strapi';
import { TDonationBody, TPaymentBody, TPaymentStatus } from '../content-types/order.types';
import { generateEmail, sendTelegramMessage } from '../../../utils/email';
const YooKassa = require('yookassa');
const nodemailer = require('nodemailer');

// Создайте экземпляр YooKassa
const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_FAKE_SHOP,
  secretKey: process.env.YOOKASSA_FAKE_SECRET,
});

// Настройте Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ваша учетная запись Gmail
    pass: process.env.EMAIL_APP_PASSWORD, // Пароль вашей учетной записи Gmail
  },
});

export default factories.createCoreController('api::order.order', ({ strapi }) => ({
  async payment(ctx) {
    const frontData = ctx.request.body as TPaymentBody;

    try {
      const payment = await yooKassa.createPayment({
        amount: {
          value: frontData.price.toFixed(2),
          currency: "RUB"
        },
        payment_method_data: {
          type: "bank_card"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://chel.wolrus.org/thanks"
        },
        description: frontData.description,
        metadata: {
          email: frontData.email,
          firstName: frontData.firstName,
          lastName: frontData.lastName,
          phone: frontData.phone,
          church: frontData.church,
          city: frontData.city,
          isDonation: 'false',
        }
      });
      return payment.confirmation.confirmation_url as string;
    } catch (error) {
      console.error('Payment creation error:', error);
      ctx.throw(400, error);
    }
  },
  async paymentStatus(ctx) {
    const paymentData = ctx.request.body as TPaymentStatus;

    console.log(paymentData);

    if (paymentData.event !== 'payment.waiting_for_capture') return;

    try {
      const payment = await yooKassa.capturePayment(paymentData.object.id);

      if (paymentData.object.metadata.isDonation === 'false') {

        const mailOptions = {
          from: `"Церковь Слово Жизни г. Челябинск" ${process.env.EMAIL_USER}`,
          to: paymentData.object.metadata.email,
          subject: 'Регистрация',
          text: 'Спасибо за регистрацию на событие!',
          html: generateEmail({
            firstName: paymentData.object.metadata.firstName,
            lastName: paymentData.object.metadata.lastName
          }),
        };

        await sendTelegramMessage(paymentData);
        await transporter.sendMail(mailOptions);
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
      const payment = await yooKassa.createPayment({
        amount: {
          value: data.price.toFixed(2),
          currency: "RUB"
        },
        payment_method_data: {
          type: "bank_card"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://chel.wolrus.org/thanks"
        },
        description: "Добровольное пожертвование",
        metadata: {
          isDonation: 'true',
        }
      });

      return payment.confirmation.confirmation_url as string;
    } catch (error) {
      console.error('Payment creation error:', error);
      ctx.throw(400, error);
    }
  },
}));
