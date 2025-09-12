import { env } from './config/env';
import { connectMongo } from './db/mongo';
import app from './core/app';
import { logger } from './core/logger';
import { verifySmtp } from './mailer/mailer';  

(async () => {
  await connectMongo();
  await verifySmtp();                           
  app.listen(env.PORT, () => logger.info(`API listening on :${env.PORT}`));
})();
