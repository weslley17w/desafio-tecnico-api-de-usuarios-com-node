import { userCreationSchema, userUpdateSchema } from './userSchema.js';

describe('userCreationSchema', () => {
  it('should validate a correct user', () => {
    const validUser = {
      name: 'Joao',
      email: 'joao@local.com',
      password: 'Senh@123',
    };

    const result = userCreationSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const validUser = {
      name: '',
      email: 'joao@local.com',
      password: 'Senh@123',
    };

    const result = userCreationSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'name');

    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Nome é obrigatório');
  });

  it('should fail if email is missing', () => {
    const validUser = {
      name: 'joao',
      email: '',
      password: 'Senh@123',
    };

    const result = userCreationSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'email');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Email é obrigatório');
  });

  it('should fail for an invalid email format', () => {
    const validUser = {
      name: 'joao',
      email: 'joao.com',
      password: 'Senh@123',
    };

    const result = userCreationSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'email');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Email invalido');
  });

  it('should fail if password is missing', () => {
    const validUser = {
      name: 'joao',
      email: 'joao@local.com',
      password: '',
    };

    const result = userCreationSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'password');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Senha é obrigatório');
  });

  it('should fail if password is too short', () => {
    const validUser = {
      name: 'joao',
      email: 'joao@local.com',
      password: 'pa',
    };

    const result = userCreationSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'password');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe(
      'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    );
  });
});
describe('userUpdateSchema', () => {
  it('should validate a correct user', () => {
    const validUser = {
      name: 'Joao',
      email: 'joao@local.com',
      password: 'Senh@123',
    };

    const result = userUpdateSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it('should fail if name is missing', () => {
    const validUser = {
      name: '',
      email: 'joao@local.com',
      password: 'Senh@123',
    };

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'name');

    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Nome é obrigatório');
  });

  it('should fail if email is missing', () => {
    const validUser = {
      name: 'joao',
      email: '',
      password: 'Senh@123',
    };

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'email');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Email é obrigatório');
  });

  it('should fail for an invalid email format', () => {
    const validUser = {
      name: 'joao',
      email: 'joao.com',
      password: 'Senh@123',
    };

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'email');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Email invalido');
  });

  it('should fail if password is missing', () => {
    const validUser = {
      name: 'joao',
      email: 'joao@local.com',
      password: '',
    };

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'password');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Senha é obrigatório');
  });

  it('should fail if password invalid', () => {
    const validUser = {
      name: 'joao',
      email: 'joao@local.com',
      password: 'pa',
    };

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.path[0] === 'password');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe(
      'A senha deve ter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caractere especial.',
    );
  });

  it('should fail if not send data', () => {
    const validUser = {};

    const result = userUpdateSchema.safeParse(validUser);
    const error = result.error?.issues.find((err) => err.code === 'custom');
    expect(result.success).toBe(false);
    expect(error?.message).toBeDefined();
    expect(error?.message).toBe('Pelo menos um campo(nome, email ou senha) deve ser fornecido');
  });
});
