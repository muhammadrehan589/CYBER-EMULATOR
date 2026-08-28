export interface IUserRepository {
  findUsers(filter: Record<string, any>): Promise<any[]>;
  findByUsername(username: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUser(empId: string, updateQuery: any): Promise<any>;
}
