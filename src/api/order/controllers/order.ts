import { factories } from '@strapi/strapi';
import { TPaymentBody, TPaymentStatus } from '../content-types/order.types';
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
          return_url: "http://localhost:3000/thanks"
        },
        description: frontData.description,
        metadata: {
          email: frontData.email,
          firstName: frontData.firstName,
          lastName: frontData.lastName,
          phone: frontData.phone,
          church: frontData.church,
          city: frontData.city,
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

    if (paymentData.event !== 'payment.waiting_for_capture') return;

    try {
      const payment = await yooKassa.capturePayment(paymentData.object.id);

      // Отправка email после успешного платежа
      const mailOptions = {
        from: `"Церковь Слово Жизни г. Челябинск" ${process.env.EMAIL_USER}`,
        to: paymentData.object.metadata.email,
        subject: 'Регистрация', // - заголовок сообщения
        text: 'Спасибо за регистрацию на событие!', // - превью сообщения
        html: generateEmail({
          firstName: paymentData.object.metadata.firstName,
          lastName: paymentData.object.metadata.lastName
        }), // - сообщение
      };

      await sendTelegramMessage(paymentData);
      await transporter.sendMail(mailOptions);

      console.log('Email sent successfully');
      return payment.status;
    } catch (error) {
      console.error('Payment capture error:', error);
      ctx.throw(400, error);
    }
  }
}));
