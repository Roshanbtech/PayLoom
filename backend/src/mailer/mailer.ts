import nodemailer from "nodemailer";
import { env } from "../config/env";
import { baseLayout } from "./templates/baseLayout";
import { logger } from "../core/logger";

const isImplicitTLS = Number(env.SMTP_PORT) === 465;

export const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,                 // smtp.gmail.com
  port: env.SMTP_PORT,                 // 465 or 587
  secure: isImplicitTLS,               // true for 465; false for 587 (STARTTLS)
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  pool: true,                          // reuse connections
  maxConnections: 5,
  maxMessages: 100,
  tls: { rejectUnauthorized: true }
});

export async function verifySmtp() {
  try {
    await transporter.verify();
    logger.info("SMTP ready");
  } catch (e: any) {
    logger.error(e, "SMTP verify failed");
  }
}

type Attachment = { filename: string; content: Buffer | string };

export async function sendMail(
  to: string | string[],
  subject: string,
  innerHtml: string,
  attachments?: Attachment[]
): Promise<boolean> {
  const html = baseLayout(subject, innerHtml);
  const text = stripHtml(innerHtml);

  try {
    const info = await transporter.sendMail({
      from: env.MAIL_FROM, // use your Gmail here (or a Gmail-verified alias)
      to,
      subject,
      html,
      text,
      attachments
    });
    logger.info({ messageId: info.messageId }, "Mail sent");
    return true;
  } catch (err: any) {
    // simple backoff retry for transient errors
    if (isTransient(err?.message)) {
      await delay(600);
      try {
        const info = await transporter.sendMail({
          from: env.MAIL_FROM, to, subject, html, text, attachments
        });
        logger.info({ messageId: info.messageId, retry: 1 }, "Mail sent (retry)");
        return true;
      } catch (e2) {
        logger.error(e2, "Mail failed after retry");
        return false;
      }
    }
    logger.error(err, "Mail failed");
    return false;
  }
}

function stripHtml(s: string) {
  return s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
function isTransient(msg?: string) {
  const m = (msg || "").toLowerCase();
  return /timeout|connection|tls|temporar|rate|throttle|try again/.test(m);
}
function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
