import { FirebaseRepository } from "../context/FirebaseRepository";

export class FirebaseUser {
  id = "";
  email = "";
  isAdmin = false;
  blocked = false;
}

class FirebaseUserRepository extends FirebaseRepository<FirebaseUser> {
  constructor() {
    super("users");
  }

  async makeAdmin(id: string): Promise<void> {
    await this.update(id, { isAdmin: true });
  }

  async revokeAdmin(id: string): Promise<void> {
    await this.update(id, { isAdmin: false });
  }

  async block(id: string): Promise<void> {
    await this.update(id, { blocked: true });
  }

  async unblock(id: string): Promise<void> {
    await this.update(id, { blocked: false });
  }
}

export const firebaseUserRepository = new FirebaseUserRepository();
