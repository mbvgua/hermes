export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
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
    // register
    user?: IUser;
    // login/update
    token?: string;
    // incase of validation error
    error?: string;
    path?: string;
  } | null;
  metadata: IPaginationData | null;
}
