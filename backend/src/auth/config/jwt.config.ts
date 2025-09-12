import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET || 'default-secret-key',
    audience: process.env.JWT_TOKEN_AUDIENCE || 'your-app-audience',
    issuer: process.env.JWT_TOKEN_ISSUER || 'your-app-issuer',
    accessTokenTtl: parseInt(process.env.JWT_ACCESS_TOKEN_TTL || '3600', 10), // 1 hour
    refreshTokenTtl: parseInt(process.env.JWT_REFRESH_TOKEN_TTL || '86400', 10), // 24 hours
  };
});