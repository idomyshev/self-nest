import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Mailjet from 'node-mailjet';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async send(sender, recipient, subject, htmlBody) {
    const mailjet = (Mailjet as any).apiConnect(
      this.configService.get<string>('MAILJET_API_KEY'),
      this.configService.get<string>('MAILJET_SECRET_KEY'),
    );

    return await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: sender.email,
            Name: sender.name,
          },
          To: [
            {
              Email: recipient.email,
            },
          ],
          Subject: subject,
          HTMLPart: htmlBody,
        },
      ],
    });
  }
}
