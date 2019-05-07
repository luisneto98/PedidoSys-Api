import axios, { AxiosInstance } from 'axios';
import { UserDevice } from 'models/userDevice';
import { firebaseKey } from 'settings';

const firebase: AxiosInstance = axios.create({
  baseURL: 'https://fcm.googleapis.com/fcm',
  headers: { Authorization: `key=${firebaseKey}` }
});

export async function sendByUser(userId: number, title: string, body: string, data: any): Promise<any> {
  const devices = await UserDevice.query().where({ userId }).whereNotNull('notificationToken');
  if (!devices.length) return;

  return await send(title, body, { userId, ...data }, null, devices.map(d => d.notificationToken));
}

export async function sendAll(title: string, body: string, data: any): Promise<any> {
  return await send(title, body, data, '/topics/all');
}

async function send(title: string, body: string, data: any, to?: string, registrationIds?: string[]): Promise<any> {
  return await firebase.post('/send', {
    to,
    registration_ids: registrationIds,
    notification: {
      title,
      body,
      icon: 'ic_notification',
      color: '#45296e'
    },
    data
  });
}