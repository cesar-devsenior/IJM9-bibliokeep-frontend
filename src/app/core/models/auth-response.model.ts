export interface AuthResponse {
  access_token: string;
  type: string;
}

export interface TokenInformacion {
   sub: string;
   "user-id": string;
   roles: string[];
}

