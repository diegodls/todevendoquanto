import {
  MailProviderInterface,
  MessageInterface,
} from "@/core/ports/providers/mail-provider-interface";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

export class MailtrapMailProvider implements MailProviderInterface {
  private readonly transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "PEGAR NO SITE DO NODE_MAILER E COLOCAR NO .ENV",
        pass: "PEGAR NO SITE DO NODE_MAILER E COLOCAR NO .ENV",
      },
    });
  }

  async sendMail(message: MessageInterface): Promise<void> {
    const sendMailData: Mail.Options = {
      to: {
        name: message.to.name,
        address: message.to.email,
      },
      from: {
        name: message.from.name,
        address: message.from.email,
      },
      subject: message.subject,
      html: message.body,
    };

    await this.transporter.sendMail(sendMailData);
  }
}
