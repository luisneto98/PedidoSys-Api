import * as raven from 'raven';
import * as settings from 'settings';

if (settings.isProduction) {
  raven.config(settings.sentryKey, {
    environment: settings.env
  }).install();
}

export function exception(err: any): void {
  if (settings.isProduction) {
    raven.captureException(err);
    return;
  }

  console.error(err);
}