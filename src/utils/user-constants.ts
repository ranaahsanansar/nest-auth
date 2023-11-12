export enum ROLES {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface Token {
  id: string;
  email: string;
  userName: string;
  role: string;
}
