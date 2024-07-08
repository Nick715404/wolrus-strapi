import { TPaymentBody } from "../api/order/content-types/order.types";

const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_FAKE_SHOP,
  secretKey: process.env.YOOKASSA_FAKE_SECRET,
});

export const getPayment = async (frontData: TPaymentBody) => {
  const response = await yooKassa.createPayment({
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
    description: "Добровольное пожертвование",
    metadata: {
      firstName: frontData.firstName,
      lastName: frontData.lastName,
      email: frontData.email,
      phone: frontData.phone,
      church: frontData.church,
      city: frontData.city,
      eventType: frontData.eventType,
      isDonation: 'false',
    }
  });
  return response;
}

export const getPeymentStatus = async (id: string,) => {
  const payment = await yooKassa.capturePayment(id);
  return payment;
};

export const getDonationPayment = async (price: number) => {
  const payment = await yooKassa.createPayment({
    amount: {
      value: price.toFixed(2),
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
  return payment;
};