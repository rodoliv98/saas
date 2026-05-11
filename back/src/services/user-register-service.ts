import { IUserRegisterRepository } from "../repository/user-register-repo";
import { UserRegisterType } from "../types/types-index";
import * as bcrypt from 'bcrypt';
import { createLoginToken } from "../utils/tokenJWT";

export interface IUserRegisterService {
  register (body: UserRegisterType): Promise<string[]>;
} 

export class UserRegisterService implements IUserRegisterService {
  constructor (private repo: IUserRegisterRepository) {}

  async register (body: UserRegisterType) {
    const hashedPassword = await bcrypt.hash(body.senha, 10);
    const user = await this.repo.register(body, hashedPassword);

    const [accessToken, refreshToken] = createLoginToken(user.id, 'userId', 'user');
    return [accessToken, refreshToken];
  }
}