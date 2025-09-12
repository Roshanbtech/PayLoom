import dotenv from 'dotenv';
dotenv.config();

function req(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is required`);
  return v;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '4000', 10),
  MONGO_URI: req('MONGO_URI'),
  JWT_SECRET: req('JWT_SECRET'),
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'token',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
  FRONTEND_ORIGIN: req('FRONTEND_ORIGIN'),
  SMTP_HOST: req('SMTP_HOST'),
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: req('SMTP_USER'),
  SMTP_PASS: req('SMTP_PASS'),
  MAIL_FROM: process.env.MAIL_FROM || 'no-reply@yourapp.com'
};
