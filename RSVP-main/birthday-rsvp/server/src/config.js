import dotenv from 'dotenv';
dotenv.config();

function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') throw new Error(`Missing env ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  adminEmail: required('ADMIN_EMAIL'),
  adminPassword: process.env.ADMIN_PASSWORD,
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH,
  corsOrigin: required('CORS_ORIGIN'),
  nodeEnv: process.env.NODE_ENV ?? 'development'
};
