import { existsSync } from 'fs';
import { resolve } from 'path';

/** Proje kökündeki .env dosyasının yolu (marcher/.env) */
export function getRootEnvPath(): string {
  const fromBackend = resolve(process.cwd(), '../.env');
  const fromRoot = resolve(process.cwd(), '.env');

  if (existsSync(fromRoot) && !process.cwd().endsWith('backend')) {
    return fromRoot;
  }
  if (existsSync(fromBackend)) {
    return fromBackend;
  }
  return fromRoot;
}
