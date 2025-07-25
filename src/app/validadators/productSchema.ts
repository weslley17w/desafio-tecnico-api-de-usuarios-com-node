import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().nonempty({ message: 'Título é obrigatório' }),
  price: z.number().positive({ message: 'Preço deve ser um número positivo' }),
  description: z.string().max(1000, { message: 'Descrição não pode exceder 1000 caracteres' }),
  created_by: z.uuidv4().nonempty({ message: 'ID do criador é obrigatório' }),
});

export const productDeleteSchema = z.object({
  id: z.string().nonempty({ message: 'Id é obrigatório' }),
});

export type productSchemaDTO = z.infer<typeof productSchema>;
export type productDeleteSchemaDTO = z.infer<typeof productDeleteSchema>;
