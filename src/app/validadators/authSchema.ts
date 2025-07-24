import { z } from 'zod';

export const authSchema = z.object({
  token: z.string().nonempty({ message: 'Token é obrigatório' }),
  created_by: z.uuidv4().nonempty({ message: 'created_by é obrigatório' }),
  expires_at: z.date(),
});

export const authLoginSchema = z.object({
  email: z.string().nonempty({ message: 'Token é obrigatório' }),
  password: z.string().nonempty({ message: 'Senha é obrigatório' }),
});

export const authParam = z.object({
  authorization: z.string().nonempty({ message: 'Id é obrigatório' }),
});

export interface tokenDTO {
  accesToken: string;
  refreshToken: string;
}

export type authSchemaDTO = z.infer<typeof authSchema>;
export type authParamDTO = z.infer<typeof authParam>;
export type authLoginSchemaDTO = z.infer<typeof authLoginSchema>;
