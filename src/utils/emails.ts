import { TPaymentStatus } from "../api/order/content-types/order.types";
import { EMAILS } from "./email.utils";

const nodemailer = require('nodemailer');

// Настройте Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Ваша учетная запись Gmail
    pass: process.env.EMAIL_APP_PASSWORD, // Пароль вашей учетной записи Gmail
  },
});

type TGenerateEmailInstanse = {
  email: string,
  htmlGenerator: any,
  firstName: string,
  lastName: string,
}

export const generateEmailInstanse = async ({ email, firstName, htmlGenerator, lastName }: TGenerateEmailInstanse) => {
  return {
    from: `"Церковь Слово Жизни г. Челябинск" ${process.env.EMAIL_USER}`,
    to: email,
    subject: 'Регистрация',
    text: 'Спасибо за регистрацию на событие!',
    html: htmlGenerator({
      firstName: firstName,
      lastName: lastName
    }),
  };
}

export const emailsPipe = async (data: TPaymentStatus) => {
  try {
    if (!data.object.metadata.email) {
      console.log('No email recipient defined, skipping email sending.');
      return;
    }
    console.log(data.object.metadata.email)
    console.log('run emails')
    let emailOptions;
    switch (data.object.metadata.eventType) {
      case 'юсурал':
        emailOptions = await generateEmailInstanse({
          email: data.object.metadata.email,
          firstName: data.object.metadata.firstName,
          lastName: data.object.metadata.lastName,
          htmlGenerator: EMAILS.youthUral,
        });
        break;
      case "бизнес":
        emailOptions = await generateEmailInstanse({
          email: data.object.metadata.email,
          firstName: data.object.metadata.firstName,
          lastName: data.object.metadata.lastName,
          htmlGenerator: EMAILS.bussines,
        });
        break;
      default:
        throw new Error(`Unknown eventType: ${data.object.metadata.eventType}`);
    }

    const info = await transporter.sendMail(emailOptions);
    return info;
  }
  catch (error) {
    if (error.response && error.response.includes('550')) {
      console.error('Invalid email address.');
      return;
    }
    return;
  }
};