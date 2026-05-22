import { CustomError } from "../errors/errorHandler";
import { ErrorCode } from "../types/constants/error-codes-constants";

export async function notifyDiscord() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new CustomError('Url do webhook não configurada', 500, ErrorCode.INTERNAL_SERVER_ERROR);
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      embeds: [
        {
          title: 'Erro no sistema',
          description: 'Não foi possível conectar ao banco',
          color: 16711680
        }
      ]
    })
  });

  if (!response.ok) {
    throw new CustomError('Falha no envio da mensagem', 502, ErrorCode.BAD_GATEWAY);
  }
}