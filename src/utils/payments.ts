import { TFormData, TPaymentBodyYouth, TPaymentBodyBussines } from "../api/order/content-types/order.types";

const YooKassa = require('yookassa');

const yooKassa = new YooKassa({
  shopId: process.env.YOOKASSA_SHOP,
  secretKey: process.env.YOOKASSA_SECRET,
});

const metadataGenerator = (data: TFormData) => {
  switch (data.type) {
    case 'youthUral': {
      const youthData = data as TPaymentBodyYouth;
      return {
        firstName: youthData.firstName,
        lastName: youthData.lastName,
        email: youthData.email,
        phone: youthData.phone,
        church: youthData.church,
        city: youthData.city,
        settlement: youthData.settlement,
        type: youthData.type,
        isDonation: 'false',
      };
    }
    case 'business': {
      const businessData = data as TPaymentBodyBussines;
      return {
        firstName: businessData.firstName,
        lastName: businessData.lastName,
        email: businessData.email,
        phone: businessData.phone,
        church: businessData.church,
        city: businessData.city,
        career: businessData.career,
        type: businessData.type,
        role: businessData.role,
        isDonation: 'false',
      };
    }
    default:
      throw new Error('Unsupported form type');
  }
};

export const getPayment = async (frontData: TFormData) => {
  const metadataObject = metadataGenerator(frontData);

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
    metadata: metadataObject,
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