import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import inlineCss from 'inline-css';
import mailgunApi from 'mailgun-js';
import * as pug from 'pug';
import { ASSETS_FOLDER, IS_DEV, IS_TEST, MAIL } from 'settings';

import { UrlService } from './url';

export interface IMail {
  providerResponse?: {
    message: string;
    id: string;
  };

  from: string;
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private mailgun: ReturnType<typeof mailgunApi>;

  constructor(private urlService: UrlService) {
    if (!IS_TEST && MAIL.credentials.apiKey) {
      this.mailgun = mailgunApi(MAIL.credentials);
    }
  }

  public async send(to: string, subject: string, template: string, data: any): Promise<IMail> {
    data = this.setDefaultVariables(data);

    const html = await this.renderTemplate(template, data);
    const mail: IMail = { from: MAIL.from, to, subject, html };

    if (IS_TEST) {
      (<any>mail).template = template;
      return mail;
    }

    if (IS_DEV) {
      await this.outputFile(mail);
      return mail;
    }

    if (!this.mailgun) {
      throw new Error('Please provide MAILGUN_APIKEY!');
    }

    mail.providerResponse = await this.mailgun.messages().send(mail);
    return mail;
  }

  private async outputFile(mail: IMail): Promise<IMail> {
    const outputDir = './output-emails';

    await fs.promises.access(outputDir).catch(() => {
      return fs.promises.mkdir(outputDir);
    });

    const filePath = `${outputDir}/${Date.now()}.html`;
    await fs.promises.writeFile(filePath, mail.html);

    console.log(`********\nEmail created: ${filePath}\n*********`);
    return mail;
  }

  private async renderTemplate(template: string, data: any): Promise<string> {
    const html = pug.renderFile(`${ASSETS_FOLDER}/mail/${template}.pug`, {
      ...data,
      pretty: IS_DEV
    });

    return inlineCss(html, { url: this.urlService.home() || 'no-url' });
  }

  private setDefaultVariables(data: any): any {
    data.urlSite = this.urlService.home();
    data.currentYear = new Date().getFullYear();
    return data;
  }
}
