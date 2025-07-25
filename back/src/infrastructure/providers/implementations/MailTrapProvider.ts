import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { IMailProvider, IMessage } from "../../../core/ports/providers/IMailProvider";

export class MailtrapMailProvider implements IMailProvider {
  private readonly transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "PEGAR NO SITE DO NODE_MAILER",
        pass: "PEGAR NO SITE DO NODE_MAILER",
      },
    });
  }

  async sendMail(message: IMessage): Promise<void> {
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
