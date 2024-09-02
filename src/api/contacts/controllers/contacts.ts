"use strict";

const { google } = require("googleapis");

module.exports = {
  async submitForm(ctx) {
    try {
      const { name, email, phone, description, agreement, theme } =
        ctx.request.body;

      // Аутентификация с помощью Google API
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      const spreadsheetId = process.env.GOOGLE_CONTACTS_SHEET_ID; // ID вашей таблицы
      const range = "Лист1!A1:D1"; // Область для записи данных

      // Добавление новой строки с данными
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: [
            [
              name,
              email,
              phone,
              description,
              theme,
              new Date().toLocaleString(),
            ],
          ],
        },
      });

      ctx.send({
        message: "Данные успешно отправлены в Google Таблицу",
        status: "success",
      });
    } catch (error) {
      ctx.status = 500;
      ctx.send({ message: "Ошибка при отправке данных", status: "error" });
      console.error("Ошибка при отправке данных в Google Sheets:", error);
    }
  },
};
