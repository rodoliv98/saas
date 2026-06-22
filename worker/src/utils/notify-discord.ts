import logger from "../lib/winston/winston";

export async function notifyDiscord(title: string, description: string) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return logger.emerg('Url do webhook não configurada');
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        embeds: [
          {
            title: `${title}`,
            description: `${description}`,
            color: 16711680
          }
        ]
      })
    });
  
    if (!response.ok) {
      return logger.emerg('Falha no envio da mensagem');
    }
    
  } catch (err) {
    logger.warning('Worker falhou ao enviar notificação pro discord');
  }
}