import { SignJWT, jwtVerify } from 'jose';
import { JWT_ALGORITHM, JWT_EXPIRATION, JWT_SECRET } from '$env/static/private';
import { createSecretKey } from 'crypto';

const secretKey = createSecretKey(JWT_SECRET, 'utf8');

export function createJwt() {
  return new SignJWT({})
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(secretKey);
}

export async function verifyJwt(token: string) {
  await jwtVerify(token, secretKey);
}
