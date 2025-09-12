
export interface TokenPayload {
  sub: number | string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtValidationResponse {
  userId: number | string;
  email: string;
}