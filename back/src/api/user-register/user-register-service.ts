import { IUserRegisterRepository } from "./user-register-repo";
import { UserRegisterType } from "../../types/types-index";
import { createLoginToken } from "../../utils/tokenJWT";
import bcrypt from 'bcrypt';

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