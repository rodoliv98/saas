export type UserLogin = {
  id: string;
  senha: string;
  kind: string;
}

export type UserRefresh = Pick<UserLogin, 'id'> & {
  role: 'user'
};