import { createUserDTO, userUpdateDTO } from '../validadators/userSchema.js';
import { User } from '../../database/models/index.js';

export class UserRepository {
  public async create(data: createUserDTO): Promise<User> {
    return User.create(data);
  }

  public async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  public async findById(id: string): Promise<User | null> {
    return await User.findOne({ where: { id } });
  }

  public async getAllUsers(): Promise<User[] | []> {
    return await User.findAll();
  }

  public async getAllUsersPaginated(
    page: number,
    limit: number,
    filters: Partial<userUpdateDTO>,
  ): Promise<{ users: User[]; total: number }> {
    const { rows, count } = await User.findAndCountAll({
      where: filters,
      limit,
      offset: (page - 1) * limit,
    });

    return { users: rows, total: count };
  }

  public async deleteUser(id: string): Promise<void> {
    User.destroy({
      where: { id },
    });
  }

  public async update(id: string, data: userUpdateDTO): Promise<User | null> {
    const user = await User.findByPk(id);
    if (!user) return null;
    await user.update(data);
    return user;
  }
}
