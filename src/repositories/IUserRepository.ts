import type { IUser } from '@/models/User';

export interface UserFilter {
  empId?: string | RegExp;
  department?: string;
  status?: string;
  $or?: Array<Record<string, RegExp>>;
}

export interface UserUpdateQuery {
  $set?: Partial<IUser>;
  $inc?: Partial<Record<keyof IUser, number>>;
}

export interface IUserRepository {
  findUsers(filter: UserFilter): Promise<IUser[]>;
  findByUsername(username: string): Promise<IUser | null>;
  createUser(userData: Partial<IUser>): Promise<IUser>;
  updateUser(empId: string, updateQuery: UserUpdateQuery): Promise<IUser | null>;
}
