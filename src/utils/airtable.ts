import Airtable from "airtable";
import { TPaymentBodyBussines, TPaymentBodyYouth, TPaymentStatus } from "../api/order/content-types/order.types";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

export const TABLES = {
  youthUral: async (data: TPaymentBodyYouth) => {
    try {
      const { church, city, email, firstName, lastName, phone, settlement } = data;
      
      const records = [
        {
          fields: {
            Имя: firstName,
            Фамилия: lastName,
            Город: city,
            Телефон: phone,
            Церковь: church,
            Почта: email,
            Размещение:  settlement === "true" ? "Нужно расселение" : "",
          },
        },
      ];
      const createdRecords = await base(process.env.AIRTABLE_TABLE_YOUTH).create(records);
      console.log('Data sent to YouthUral Table');
    }
    catch (error) {
      console.error('Error sending data to Airtable:', error);
      throw error;
    }
  },
  bussines: async (data: TPaymentBodyBussines) => {
    try {
      const { church, city, email, firstName, lastName, phone, role, career } = data;
      console.log(role);
      const records = [
        {
          fields: {
            Имя: firstName,
            Фамилия: lastName,
            Город: city,
            Телефон: phone,
            Церковь: church,
            Почта: email,
            Должность: role,
            "Род деятельности": career,
          },
        },
      ];
      const createdRecords = await base(process.env.AIRTABLE_TABLE_BUSINESS).create(records);
      console.log('Data sent to Business Table');
    }
    catch (error) {
      console.error('Error sending data to Airtable:', error);
      throw error;
    }
  },
}

export const airtablePipe = (payment: TPaymentStatus) => {
  const { metadata } = payment.object;
  switch (payment.object.metadata.type) {
    case "youthUral":
      return TABLES.youthUral(metadata as TPaymentBodyYouth);
    case "business":
      return TABLES.bussines(metadata as TPaymentBodyBussines);
    default:
      throw new Error(`Unknown eventType: ${metadata.type}`);
  }
};