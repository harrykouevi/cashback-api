
import * as crypto from 'crypto';

const secretKey = 'yourSecretKey'; // Your HMAC secret key

export const  verifySignature = (payload: any, signature: string): boolean => {
    const hmac = crypto.createHmac('sha256', secretKey);
    const digest = hmac.update(JSON.stringify(payload)).digest('hex');
    return digest === signature;
};
