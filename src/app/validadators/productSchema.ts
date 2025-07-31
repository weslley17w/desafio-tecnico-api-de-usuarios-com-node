import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().nonempty({ message: 'Título é obrigatório' }),
  price: z.number().positive({ message: 'Preço deve ser um número positivo' }),
  description: z.string().max(1000, { message: 'Descrição não pode exceder 1000 caracteres' }),
  created_by: z.uuidv4().nonempty({ message: 'ID do criador é obrigatório' }),
});

export const productUpdateSchema = z.object({
  title: z.string().optional(),
  price: z.number().positive({ message: 'Preço deve ser um número positivo' }).optional(),
  description: z.string().max(1000, { message: 'Descrição não pode exceder 1000 caracteres' }).optional(),
});

export const productDeleteSchema = z.object({
  id: z.uuid().nonempty({ message: 'Id é obrigatório' }),
});

export type productSchemaDTO = z.infer<typeof productSchema>;
export type productDeleteSchemaDTO = z.infer<typeof productDeleteSchema>;
