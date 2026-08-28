import bcrypt from 'bcryptjs';
import { IUserRepository } from '@/repositories/IUserRepository';

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getUsers(department?: string | null, search?: string | null, status?: string | null) {
    const filter: Record<string, any> = {};

    if (department && department !== 'ALL') {
      filter.department = department;
    }

    if (status) {
      filter.status = status;
    }

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [
        { empId: regex },
        { name: regex },
        { username: regex },
      ];
    }

    return this.userRepository.findUsers(filter);
  }

  async authenticate(username?: string | null, password?: string | null) {
    if (!username || !password) {
      throw new Error('Username and password are required.');
    }

    const user = await this.userRepository.findByUsername(username);

    if (!user) {
      throw new Error('Invalid username or password.');
    }

    if (user.status === 'suspended') {
      throw new Error('Account suspended. Contact your administrator.');
    }

    const storedHash = user.passwordHash;

    if (!storedHash) {
      throw new Error('No password set. Contact your administrator.');
    }

    const isMatch = await bcrypt.compare(password, storedHash);

    if (!isMatch) {
      throw new Error('Invalid username or password.');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async createUser(userData: any) {
    let passwordHash: string | undefined;
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(userData.password, salt);
    }

    const user = await this.userRepository.createUser({
      empId: userData.empId,
      name: userData.name,
      username: userData.username,
      department: userData.department,
      role: userData.role || 'Player',
      score: 1000,
      status: 'active',
      ...(passwordHash && { passwordHash }),
    });

    const userObj = user.toObject();
    const { passwordHash: _, ...safeUser } = userObj;
    return safeUser;
  }

  async updateUser(empId: string, updates?: any, inc?: any) {
    if (!empId || (!updates && !inc)) {
      throw new Error('empId and updates or inc are required.');
    }

    const updateQuery: any = {};
    if (updates) updateQuery.$set = updates;
    if (inc) updateQuery.$inc = inc;

    const updatedUser = await this.userRepository.updateUser(empId, updateQuery);
    if (!updatedUser) {
      throw new Error('User not found.');
    }

    return updatedUser;
  }
}
