import { createLogger, format, config, transports } from 'winston';
import LokiTransport from 'winston-loki';
/*
  {
    emerg: 0, <-- nao aparece no grafana
    alert: 1, <-- nao aparece no grafana
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7
  }
*/

const isProduction = process.env.NODE_ENV === 'production';
const { combine, timestamp, errors } = format;
const baseFormat = combine(
  errors({ stack: true }),
  timestamp()
);
const transportConsole = new transports.Console({
  format: format.combine(
    format.colorize(), 
    format.simple()
  )
});

const transportList: any[] = [transportConsole];
/* const lokiUrl = process.env.LOKI_HOST || 'http://loki:3100';

transportList.push(
  new LokiTransport({
    host: lokiUrl,
    labels: { app: 'api.eldur' },
    replaceTimestamp: true,
    onConnectionError: (err) => {
      console.error('Erro ao conectar no Loki', err);
    }
  })
) */

const logger = createLogger({
  levels: config.syslog.levels,
  level: isProduction ? 'info' : 'debug',
  format: baseFormat,
  transports: transportList
});

export default logger;