import cors from 'cors';
import { env } from '../config/env';

export const corsMw = cors({
  origin: env.FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
});
