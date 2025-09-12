import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { corsMw } from './cors';
import { errorHandler } from './error';
import authRoutes from '../modules/auth/routes';
import slipRoutes from '../modules/salarySlips/routes';
import expenseRoutes from '../modules/expenses/routes';
import usersRoutes from '../modules/users/routes';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(corsMw);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/salary-slip', slipRoutes);
app.use('/expense', expenseRoutes);
app.use('/users', usersRoutes);

app.use(errorHandler);

export default app;
