import dotenv from 'dotenv';

const ENV_FILE = dotenv.config().parsed || {};

export const NODE_ENV = (process.env.NODE_ENV || 'production').trim();
export const SENTRY_DSN = (process.env.SENTRY_DSN || '').trim();

export const VERSION = (process.env.VERSION || ENV_FILE.VERSION || 'dev').trim();

export const API_DNS = (process.env.API_DNS || '').trim();
export const APP_DNS = (process.env.APP_DNS || '').trim();

export const FIREBASE_KEY = (process.env.FIREBASE_KEY || '').trim();

export const IS_DEV = NODE_ENV !== 'production' && NODE_ENV !== 'test';
export const IS_PROD = NODE_ENV === 'production';
export const IS_TEST = NODE_ENV === 'test';

export const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
export const DATABASE_DB = process.env.DATABASE_DB || 'waproject';
export const DATABASE_USER = process.env.DATABASE_USER || 'docker';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '123mudar';
export const DATABASE_PORT = Number(process.env.DATABASE_PORT) || 3002;

export const BCRYPT_SALT_FACTOR = NODE_ENV === 'test' ? 4 : 11;

export const ASSETS_FOLDER = `${__dirname}/assets`;

export const AUTH = {
  timeout: 480, // 8 hours
  appTimeout: 1440, // 24 hours
  resetPasswordTimeout: 1 * 60 * 24, //2 days
  secret: Buffer.from(
    'RSd7w8utAWSjmJ8QOGt2OayydAqoUmL3sBTY7PqCVqOqaNn3RH38lMlNdDv5zoTQZH8GrR80YNFpQ3jKnDRMPDuwqaODObyyX0LS',
    'base64'
  ).toString('utf8')
};

export const MAIL = {
  from: process.env.MAILGUN_FROM,
  credentials: {
    apiKey: process.env.MAILGUN_APIKEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
