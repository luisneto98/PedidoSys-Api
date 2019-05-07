import { dns } from 'settings';

export function home(): string {
  return dns;
}

export function content(content: string): string {
  return `${dns}/api/content/${content}`;
}

export function resetPassword(token: string): string {
  return `${dns}/nova-senha?t=${token}`;
}

export function loginSocial(token: string): string {
  return `${dns}/social-callback?t=${token}`;
}

export function loginMessage(message: string): string {
  return `${dns}/social-callback?m=${message}`;
}

export function facebookCallback(): string {
  return `${dns}/api/admin/auth/facebook/callback`;
}

export function googleCallback(): string {
  return `${dns}/api/admin/auth/google/callback`;
}