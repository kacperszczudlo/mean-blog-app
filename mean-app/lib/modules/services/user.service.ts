import bcrypt from 'bcryptjs';
import { IUser } from '../models/user.model';
import UserModel from '../schemas/user.schema';

export default class UserService {
  async createUser(payload: Pick<IUser, 'name' | 'email' | 'password'>): Promise<Omit<IUser, 'password'>> {
    const existing = await UserModel.findOne({ email: payload.email.toLowerCase() });
    if (existing) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const created = await UserModel.create({
      name: payload.name,
      email: payload.email.toLowerCase(),
      password: hashedPassword,
      role: 'user'
    });

    const { password, ...safeUser } = created.toObject();
    return safeUser;
  }

  async validateUser(email: string, plainPassword: string): Promise<IUser | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) return null;

    const isValid = await bcrypt.compare(plainPassword, user.password);
    if (!isValid) return null;

    return user.toObject();
  }

  async getById(id: string): Promise<IUser | null> {
    const user = await UserModel.findById(id, { password: 0 });
    return user ? user.toObject() : null;
  }
}
