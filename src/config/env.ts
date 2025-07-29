import { z } from 'zod';

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().int().positive(),
  AUTH_CONFIG_SECRET: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PORT: z.coerce.number().int().positive(),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  REDIS_PASSWORD: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.coerce.number().int().positive(),
});

const parcedEnv = envSchema.safeParse(process.env);
if (!parcedEnv.success) {
  throw new Error(`Erro nas variáveis de ambiente: ${parcedEnv.error.message}`);
}

export const env = parcedEnv.data;
