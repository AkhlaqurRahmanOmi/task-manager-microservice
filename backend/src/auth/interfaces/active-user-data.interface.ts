export interface ActiveUserData {
  sub: number | string;
  email: string;
  iat?: number;
  exp?: number;
}