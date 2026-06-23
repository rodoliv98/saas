import { createLogger, format, config, transports } from 'winston';
import LokiTransport from 'winston-loki';
/*
  {
    emerg: 0,
    alert: 1,
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
const lokiUrl = process.env.GRAFANA_LOKI_HOST || 'http://loki:3100';

transportList.push(
  new LokiTransport({
    host: lokiUrl,
    basicAuth: `${process.env.GRAFANA_LOKI_USER}:${process.env.GRAFANA_LOKI_TOKEN}`,
    labels: { app: 'worker.eldur' },
    format: format.json(),
    replaceTimestamp: true,
    onConnectionError: (err) => {
      process.env.NODE_ENV === 'production'
      ? console.error('Erro ao conectar no Loki', err)
      : null
    }
  })
)

const logger = createLogger({
  levels: config.syslog.levels,
  level: isProduction ? 'info' : 'debug',
  format: baseFormat,
  transports: transportList
});

export default logger;