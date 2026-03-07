export declare class EncryptionService {
    private readonly key;
    constructor();
    encrypt(text: string): string;
    decrypt(data: string): string;
    encryptJson(obj: Record<string, any>): string;
    decryptJson(data: string): Record<string, any>;
}
