import { TPaymentStatus } from "../api/order/content-types/order.types";

export type TGenerateEmail = {
  firstName: string,
  lastName: string,
}

export const EMAILS = {
  youthUral: (person: TGenerateEmail) => {
    return `
    <div class="email">
      <div class="container" style="max-width: 1000px; width: 95%; margin: 0 auto;">
        <div class="wrapper" style="background-color: #eeeeee; border-radius: 15px; padding: 50px; align-items: center;">
          <span style="display: block; margin-top: 20px;">Уважаемый ${person.lastName} ${person.firstName}</span>
          <h1>Привет, ты зарегистрировался на ЮСУРАЛ!</h1>
          <p style="font-size: 20px;">
            Мы очень рады, что ты приедешь к нам, надеемся, что ты приедешь не один ❤️
          </p>
          <p style="font-size: 20px;">
            Чтобы оставаться на связи, знать обо всех спикерах, расписании, присоединяйся к нашему телеграмм: <a href='https://t.me/youthural22'>https://t.me/youthural22</a>
          </p>
          <span style="font-size: 20px;">Увидимся с 8-11 августа в Челябинске!</span>
        </div>
      </div>
    </div>
  `;
  },
  bussines: (person: TGenerateEmail) => {
    return `
    <div class="email">
      <div class="container" style="max-width: 1000px; width: 95%; margin: 0 auto;">
        <div class="wrapper"
          style="background-color: #eff2f9; border-radius: 30px; padding: 50px; align-items: center; text-align: center;">
          <img src="" alt="Иконка 'Спасибо за регистрацию'">
          <span style="display: block; margin-top: 20px;">Уважаемый ${person.lastName} ${person.firstName}</span>
          <h1>Спасибо, что зарегистрировались на Бизнесс-Конференцию!</h1>
          <p>
            Мы очень рады, что ты приедешь к нам, надеемся, что ты приедешь не один❤️
          </p>
          <p>
            Чтобы оставаться на связи, знать обо всех спикерах, расписании, присоединяйся к нашему телеграмм каналу - <a href="https://t.me/youthural22">ЮСУрал</a>
          </p>
          <span>Увидимся с 8-11 августа в Челябинске!</span>
        </div>
      </div>
    </div>
  `;
  }
};

export async function sendTelegramMessage(message: TPaymentStatus) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  const telegramMessage = `Новый платеж:
  Имя: ${message.object.metadata.firstName} ${message.object.metadata.lastName}
  Email: ${message.object.metadata.email}
  Сумма: ${message.object.amount.value}
  Описание: ${message.object.metadata.eventType}
  Номер телефона: ${message.object.metadata.phone}
  Церковь: ${message.object.metadata.church}
  Город: ${message.object.metadata.city}
  `;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: telegramChatId,
      text: telegramMessage,
    }),
  });

  if (!response.ok) {
    console.error('Failed to send message to Telegram:', response.statusText);
  }
}