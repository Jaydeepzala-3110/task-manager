import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import createHttpError from 'http-errors';
import Routes from './routes/index';
import { serve, setup } from 'swagger-ui-express';
import * as openApi from './documentation/swagger.json';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, 
}));

app.use(
  cors({
    origin: [
      'https://taskify.dpdns.org', 
      'https://www.taskify.dpdns.org',
      'http://taskify.dpdns.org', 
      'http://www.taskify.dpdns.org',
      'http://localhost:4000', 
      'http://localhost:80'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200, 
})
);

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

app.use('/api', Routes);

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

app.use((_req, _res, next) => {
  next(createHttpError(404, 'Not Found'));
});

type HttpErrorLike = { status?: number; message?: string };

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  const { status, message } = (err as HttpErrorLike) || {};
  res.status(status || 500).json({ error: message });
});

export default app;