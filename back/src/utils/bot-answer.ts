// vai ter que usar try/catch aqui provavelmente
export async function botAnswer (chatId: bigint, text: any) { 
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown'
          })
        });
}