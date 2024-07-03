import { TPaymentStatus } from "../api/order/content-types/order.types";

export type TGenerateEmail = {
  firstName: string,
  lastName: string,
}

export const generateEmail = (person: TGenerateEmail) => {
  return `
  <div class="email">
    <div class="container" style="max-width: 1000px; width: 95%; margin: 0 auto;">
      <div class="wrapper"
        style="background-color: #eff2f9; border-radius: 30px; padding: 50px; align-items: center; text-align: center;">
        <img src="" alt="Иконка 'Спасибо за регистрацию'">
        <span style="display: block; margin-top: 20px;">Уважаемый ${person.lastName} ${person.firstName}</span>
        <h1>Спасибо за регистрацию на наше событие!</h1>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum repellat natus molestias et, incidunt
          provident quis, qui, fugit praesentium laudantium totam pariatur a officiis eaque odit iste minima accusantium
          exercitationem!
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus voluptas nostrum voluptatibus vel debitis
          deleniti maxime vero delectus consectetur quo cupiditate placeat, libero ipsam officiis voluptate incidunt
          odit doloribus! Cumque!
        </p>
      </div>
    </div>
  </div>
`;
}

// Функция для отправки сообщения в Telegram
export async function sendTelegramMessage(message: TPaymentStatus) {
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

  console.log(message);

  const telegramMessage = `Новый платеж:
  Имя: ${message.object.metadata.firstName} ${message.object.metadata.lastName}
  Email: ${message.object.metadata.email}
  Сумма: ${message.object.amount.value}
  Описание: ${message.object.description}
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

  console.log(response);

  if (!response.ok) {
    console.error('Failed to send message to Telegram:', response.statusText);
  }
}
