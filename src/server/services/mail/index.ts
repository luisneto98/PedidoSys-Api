import * as fs from 'fs';
import * as inlineCss from 'inline-css';
import * as mailgunApi from 'mailgun-js';
import * as pug from 'pug';
import * as settings from 'settings';

import * as urlService from '../url';

let mailgun: ReturnType<typeof mailgunApi>;

if (!settings.isTest && settings.mail.credentials.apiKey) {
  mailgun = mailgunApi(settings.mail.credentials);
}

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

export async function send(to: string, subject: string, template: string, data: any): Promise<IMail> {
  data = setDefaultVariables(data);

  const html = await renderTemplate(template, data);
  const mail: IMail = { from: settings.mail.from, to, subject, html };

  if (settings.isTest) {
    (<any>mail).template = template;
    return mail;
  }

  if (settings.isDevelopment) {
    await outputFile(mail);
    return mail;
  }

  if (!mailgun) {
    throw new Error('Please provide MAILGUN_APIKEY!');
  }

  mail.providerResponse = await mailgun.messages().send(mail);
  return mail;
}

async function outputFile(mail: IMail): Promise<IMail> {
  const outputDir = './output-emails';

  await fs.promises.access(outputDir).catch(() => {
    return fs.promises.mkdir(outputDir);
  });

  const filePath = `${outputDir}/${Date.now()}.html`;
  await fs.promises.writeFile(filePath, mail.html);

  console.log(`********\nEmail created: ${filePath}\n*********`);
  return mail;
}

async function renderTemplate(template: string, data: any): Promise<string> {
  const html = pug.renderFile(`${__dirname}/templates/${template}.pug`, {
    ...data,
    pretty: settings.isDevelopment
  });

  return await inlineCss(html, { url: urlService.home() || 'no-url' });
}

function setDefaultVariables(data: any): any {
  data.urlSite = urlService.home();
  data.currentYear = new Date().getFullYear();
  return data;
}