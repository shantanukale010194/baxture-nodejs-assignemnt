import { UserDetailsInterface } from "../interface";

/**
 * In Memory Database class for user data management
 */
export class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  private users: UserDetailsInterface[];
  public constructor() {
    this.users = [];
  }

  static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  static setInstance(instance: InMemoryDatabase) {
    InMemoryDatabase.instance = instance;
  }

  getUsers(): UserDetailsInterface[] {
    return this.users;
  }

  getUserById(userId: string): UserDetailsInterface | undefined {
    return this.users.find((user) => user.userId === userId);
  }

  createUser(user: UserDetailsInterface): UserDetailsInterface {
    const newUser = { ...user, id: String(this.users.length + 1) };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(
    updatedUser: UserDetailsInterface
  ): UserDetailsInterface | undefined {
    const index = this.users.findIndex(
      (user) => user.userId === updatedUser.userId
    );

    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }

    return undefined;
  }

  deleteUser(userId: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.userId !== userId);
    return this.users.length !== initialLength;
  }
}
