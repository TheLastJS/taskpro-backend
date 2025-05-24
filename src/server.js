import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.js'; // Corrected import name
import authRouter from './routes/auth.js';
import boardsRouter from './routes/board.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { helpRouter } from './routes/help.js'; // Added helpRouter import

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

  // API Documentation Swagger DOCS
  app.use('/api-docs', swaggerDocs());

  // Routes

  app.use('/users', userRouter); // Corrected variable name
  app.use('/auth', authRouter);
  app.use('/boards', boardsRouter);

  app.use('/api', helpRouter); // Reverted to /api for helpRouter

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
