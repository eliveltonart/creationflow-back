import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

@Injectable()
export class EncryptionService {
  private readonly key: Buffer;

  constructor() {
    const raw = process.env.ENCRYPTION_KEY;
    if (!raw || raw.length < 32) {
      // Derive a 32-byte key from the JWT secret or fallback
      const secret = process.env.JWT_SECRET || 'freelancer-pm-secret-key-2024';
      this.key = crypto.createHash('sha256').update(secret).digest();
    } else {
      this.key = Buffer.from(raw.slice(0, 64), 'hex').slice(0, 32);
    }
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv) as crypto.CipherGCM;
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    // format: hex(iv):hex(tag):hex(encrypted)
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(data: string): string {
    const parts = data.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted data format');
    const iv = Buffer.from(parts[0], 'hex');
    const tag = Buffer.from(parts[1], 'hex');
    const encrypted = Buffer.from(parts[2], 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv) as crypto.DecipherGCM;
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final('utf8');
  }

  encryptJson(obj: Record<string, any>): string {
    return this.encrypt(JSON.stringify(obj));
  }

  decryptJson(data: string): Record<string, any> {
    return JSON.parse(this.decrypt(data));
  }
}
