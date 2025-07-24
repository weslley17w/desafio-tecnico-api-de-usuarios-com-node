import { RefreshToken, User } from '../../database/models/index.js';
import { authSchemaDTO } from '../validadators/authSchema.js';

export class AuthRepository {
  public async create(data: authSchemaDTO): Promise<RefreshToken> {
    return RefreshToken.create(data);
  }

  public async deleteUserCreateId(userId: string): Promise<void> {
    RefreshToken.destroy({
      where: { created_by: userId },
    });
  }

  public async findByToken(token: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({
      where: { token },
      include: [{ model: User, as: 'creator' }],
    });
  }
}
