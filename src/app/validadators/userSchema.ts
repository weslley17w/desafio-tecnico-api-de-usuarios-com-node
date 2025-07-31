import { z } from 'zod';

export const userCreationSchema = z.object({
  id: z.string().optional(),
  name: z.string().nonempty({ message: 'Nome é obrigatório' }),
  email: z
    .string()
    .nonempty({ message: 'Email é obrigatório' })
    .trim()
    .pipe(z.email({ message: 'Email invalido' })),
  password: z
    .string()
    .nonempty({ message: 'Senha é obrigatório' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, {
      message:
        'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    }),
});

export const userUpdateSchema = z
  .object({
    name: z.string().nonempty({ message: 'Nome é obrigatório' }).optional(),
    email: z
      .string()
      .nonempty({ message: 'Email é obrigatório' })
      .trim()
      .pipe(z.email({ message: 'Email invalido' }))
      .optional(),
    password: z
      .string()
      .nonempty({ message: 'Senha é obrigatório' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/, {
        message:
          'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
      })
      .optional(),
  })
  .refine(
    (data) => {
      return !!data.name || !!data.email || !!data.password;
    },
    {
      message: 'Pelo menos um campo(nome, email ou senha) deve ser fornecido',
      path: ['name', 'email', 'password'],
    },
  );

export const userDeleteSchema = z.object({
  id: z.string().nonempty({ message: 'Id é obrigatório' }),
});

export const userFindByIdSchema = z.object({
  id: z.string().nonempty({ message: 'Id é obrigatório' }),
});

export const userUpdateIdParam = z.object({
  id: z.string().nonempty({ message: 'Id é obrigatório' }),
});

export type createUserDTO = z.infer<typeof userCreationSchema>;
export type userDeleteDTO = z.infer<typeof userDeleteSchema>;
export type userFindByIdDTO = z.infer<typeof userFindByIdSchema>;
export type userUpdateDTO = z.infer<typeof userUpdateSchema>;
export type userUpdateIdParamDTO = z.infer<typeof userUpdateIdParam>;
