#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from '../app.js';
import http from 'http';

import getLogger from '../utils/logger.js';
import { normalizePort } from '../utils/handleEnv.js';
import { configManager } from '../config/index.js';
import { initSheetsClient } from '../service/getSheetClient.js';

const logger = getLogger('www');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(configManager.web.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

// server.listen(port);
// server.on('error', onError);
// server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
  logger.info('Listening on ' + bind);
}

async function bootstrap() {
  try {
    await initSheetsClient();
    logger.info('google sheet 連線成功');

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
  } catch (error) {
    logger.error(`google sheet 連線失敗:${error}`);
    process.exit(1);
  }
}

bootstrap();
