import { Injectable, Logger } from "@nestjs/common";
import nodemailer, { type Transporter } from "nodemailer";

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter | null = null;

  get configured(): boolean {
    return !!process.env.SMTP_HOST;
  }

  private getTransporter(): Transporter | null {
    if (!process.env.SMTP_HOST) return null;
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 587),
        secure: Number(process.env.SMTP_PORT ?? 587) === 465,
        auth: process.env.SMTP_USER
          ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
          : undefined,
      });
    }
    return this.transporter;
  }

  async send(to: string, subject: string, text: string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      this.logger.warn(`[DEV EMAIL] → ${to} | ${subject}: ${text}`);
      return;
    }
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM ?? "Elite Drive <no-reply@elitedrive.mn>",
        to,
        subject,
        text,
      });
    } catch (err) {
      this.logger.error(`Email илгээх алдаа: ${String(err)}`);
    }
  }
}
