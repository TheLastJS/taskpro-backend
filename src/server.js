import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import usersRouter from './routes/user.js';
import authRouter from './routes/auth.js';

export const startServer = () => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Routes
  app.use('/users', usersRouter);
  app.use('/auth', authRouter);

  // 404 Handler
  app.use(notFoundHandler);

  // Error Handler
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return server;
};
