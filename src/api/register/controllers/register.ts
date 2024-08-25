const { createCoreController } = require("@strapi/strapi").factories;
const axios = require("axios");
const { google } = require("googleapis");

module.exports = createCoreController("api::upload.upload", ({ strapi }) => ({
  async upload(ctx) {
    try {
      const { files } = ctx.request.files;
      const formData = ctx.request.body;

      // Загрузка файла на Яндекс.Диск
      const yandexLink = await uploadToYandexDisk(files.paymentFile);

      // Добавление ссылки в Google Таблицу
      await addToGoogleSheet(yandexLink, formData);

      ctx.send({ link: yandexLink });
    } catch (error) {
      strapi.log.error("Upload error:", error);
      ctx.throw(500, "Internal server error");
    }
  },
}));

async function uploadToYandexDisk(file) {
  const YANDEX_DISK_TOKEN = process.env.YANDEX_DISK_TOKEN;

  const uploadUrlResponse = await axios.get(
    "https://cloud-api.yandex.net/v1/disk/resources/upload",
    {
      headers: {
        Authorization: `OAuth ${YANDEX_DISK_TOKEN}`,
      },
      params: {
        path: `/uploads/${file.name}`,
        overwrite: "true",
      },
    }
  );

  const uploadUrl = uploadUrlResponse.data.href;

  const formData = new FormData();
  formData.append("file", file.buffer, file.name);

  await axios.put(uploadUrl, formData, {
    headers: {
      "Content-Type": "application/octet-stream",
    },
  });

  return `https://disk.yandex.ru/client/disk/uploads/${file.name}`;
}

async function addToGoogleSheet(link, formData) {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
  const GOOGLE_CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_CREDENTIALS,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Sheet1!A1", // Укажите нужный диапазон
    valueInputOption: "RAW",
    requestBody: {
      values: [[link, JSON.stringify(formData)]], // Запись ссылки и данных формы
    },
  });
}
