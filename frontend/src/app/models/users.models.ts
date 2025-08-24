export enum UserRoles {
  Customer = 'customer',
  Admin = 'admin',
}

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: UserRoles;
  created_at?: string;
  is_deleted?: string;
}

interface IPaginationData {
  previous_page: number;
  current_page: number;
  next_page: number;
  total_items: number;
  total_page: number;
}

export interface UserResponse {
  code: number;
  status: string;
  message: string;
  data: {
    user?: IUser;
    role?: UserRoles;
    token?: string;
    // incase of validation error
    error?: string;
    path?: string;
  } | null;
  metadata: IPaginationData | null;
}

export interface DecodedTokenPayload {
  id: string;
  username: string;
  email: string;
  role: string; // dont user UserRole enum. problem in destructuring token
  iat: number;
  exp: number;
}
