import pino from 'pino';
import pretty from 'pino-pretty';

type TLoggerPrefix = 'www' | 'App';
// logger 輸出樣式
export default function getLogger(prefix: TLoggerPrefix, logLevel = 'debug') {
  return pino(
    { level: logLevel },
    pretty({
      messageFormat: `[${prefix}]: {msg}`,
      colorize: true,
      sync: true,
    })
  );
}
