import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const SALT_LENGTH = 16;
const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

/**
 * Хеширует пароль с использованием PBKDF2
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH).toString('hex');
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Проверяет пароль против хеша
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  
  if (!salt || !hash) {
    return false;
  }

  const hashToVerify = pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  const hashBuffer = Buffer.from(hash, 'hex');
  
  // Используем timing-safe сравнение для защиты от timing attacks
  return hashToVerify.length === hashBuffer.length && 
         timingSafeEqual(hashToVerify, hashBuffer);
}
