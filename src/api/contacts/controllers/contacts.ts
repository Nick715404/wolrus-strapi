export type TFrontData = {
  name: string,
  email: string,
  phone: string,
  theme: string,
  description: string,
}

export default {
  sendMail: async (ctx) => {
    try {
      const frontendData: TFrontData = ctx.request.body;
      const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

      const telegramMessage = `
      Форма связи:
        Тема обращения: ${frontendData.theme},
        Имя: ${frontendData.name},
        Почта: ${frontendData.email},
        Телефон: ${frontendData.phone},
        Описание вопроса: ${frontendData.description}`;

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
        return {
          status: 'not_sended'
        }
      }

      return {
        status: 'sended'
      }
    }
    catch (err) {
      ctx.body = err;
    }
  }
};
