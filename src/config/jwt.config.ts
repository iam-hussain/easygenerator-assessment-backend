import { registerAs } from '@nestjs/config';

export const jwtSecrets = {
  secretKey: process.env.JWT_SECRET_KEY_KEY || 'rzxlszyykpbgqcflzxsqcysyhljt',
  expiresIn: process.env.JWT_EXPIRES_IN || '3600s',
};

export default registerAs('jwt', () => jwtSecrets);
