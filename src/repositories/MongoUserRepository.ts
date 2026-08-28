import User from '@/models/User';
import { IUserRepository } from './IUserRepository';

export class MongoUserRepository implements IUserRepository {
  async findUsers(filter: Record<string, any>): Promise<any[]> {
    return User.find(filter).sort({ score: -1 }).lean();
  }

  async findByUsername(username: string): Promise<any> {
    const cleanUsername = username.trim().toLowerCase().replace(/^@/, '');
    return User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') },
    }).lean();
  }

  async createUser(userData: any): Promise<any> {
    return User.create(userData);
  }

  async updateUser(empId: string, updateQuery: any): Promise<any> {
    return User.findOneAndUpdate(
      { empId },
      updateQuery,
      { new: true }
    ).lean();
  }
}
