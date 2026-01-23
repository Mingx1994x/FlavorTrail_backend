import express from 'express';
import path from 'path';
import { pinoHttp } from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import getLogger from './utils/logger.js';
import { appError } from './utils/handleError.js';

// routes
import indexRouter from './routes/index.js';
import usersRouter from './routes/user.js';
import authRouter from './routes/auth.routes.js';
// import categoryRouter from './routes/category.js';

import type { Request, Response, NextFunction } from 'express';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

const logger = getLogger('App');

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', usersRouter);
// app.use('/categories', categoryRouter);

// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(new appError(404, 'Not Found'));
});

// error handler
app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof appError && err.isOperational) {
    return res.status(err.status).json({
      status: 'failed',
      message: err.message,
    });

    // 非預期錯誤
  }
  logger.error(err);
  res.status(500).json({
    status: 'error',
    message: '伺服器錯誤',
  });
});

export default app;
