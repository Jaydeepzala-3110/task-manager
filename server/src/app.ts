import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import { serve, setup } from 'swagger-ui-express';
import * as openApi from './documentation/swagger.json';


const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use(
  '/documentation',
  serve,
  setup(openApi, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.use((_req, _res, next) => {
  next(createHttpError(404, 'Not Found'));
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any)?.status || 500;
  const message = (err as any)?.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

export default app;


