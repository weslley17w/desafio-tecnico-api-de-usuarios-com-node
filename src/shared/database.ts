export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

const userDatabase = new Map<string, User>();

const mockUsers: User[] = [
  {
    id: '3f9f3b68-0e2f-4fcd-a5d7-1fd6e7d2b9a1',
    name: 'Alice Silva',
    email: 'alice.silva@localhost.com',
    password: 'senha123',
  },
  {
    id: 'a72e0459-bc5d-4cc6-9b1f-79f81b8cf77f',
    name: 'Bruno Costa',
    email: 'bruno.costa@localhost.com',
    password: 'minhasenha456',
  },
  {
    id: 'f26d07f1-2c0e-45a5-90aa-1d2c5de58b49',
    name: 'Carla Mendes',
    email: 'carla.mendes@localhost.com',
    password: 'abc123456',
  },
];

mockUsers.forEach((user) => {
  userDatabase.set(user.id, user);
});

export function addUser(user: User): void {
  userDatabase.set(user.id, user);
}

export function getUser(id: string): User | undefined {
  return userDatabase.get(id);
}

export function getAllUsers(): User[] {
  return Array.from(userDatabase.values());
}

export function updateUser(
  id: string,
  updatedUser: Partial<User>,
): User | undefined {
  const user = userDatabase.get(id);
  if (!user) return undefined;

  const newUser = { ...user, ...updatedUser };
  userDatabase.set(id, newUser);
  return newUser;
}

export function deleteUser(id: string): boolean {
  return userDatabase.delete(id);
}

export function getUserByEmail(email: string): User | undefined {
  for (const user of userDatabase.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return undefined;
}

export default userDatabase;
