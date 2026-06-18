import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  get configured(): boolean {
    return !!process.env.MOBICOM_SMS_URL;
  }

  /**
   * Mobicom SMS gateway руу мессеж илгээх.
   * Түлхүүр (MOBICOM_SMS_URL) тохируулаагүй бол dev горимд консолд хэвлэнэ.
   */
  async send(to: string, text: string): Promise<void> {
    const url = process.env.MOBICOM_SMS_URL;
    if (!url) {
      this.logger.warn(`[DEV SMS] → +976${to}: ${text}`);
      return;
    }

    const params = new URLSearchParams({
      username: process.env.MOBICOM_SMS_USER ?? "",
      password: process.env.MOBICOM_SMS_PASS ?? "",
      from: process.env.MOBICOM_SMS_FROM ?? "EliteDrive",
      to: `976${to}`,
      text,
    });

    try {
      const res = await fetch(`${url}?${params.toString()}`, {
        method: "GET",
      });
      if (!res.ok) {
        this.logger.error(`Mobicom SMS алдаа: ${res.status} ${await res.text()}`);
      }
    } catch (err) {
      this.logger.error(`Mobicom SMS exception: ${String(err)}`);
    }
  }
}
