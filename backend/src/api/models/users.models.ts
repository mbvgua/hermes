import { Request } from "express";

export enum UserRoles {
  Customer = "customer",
  Admin = "admin",
}

export interface IUsers {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRoles;
}

export interface IPayload {
  id: string;
  username: string;
  email: string;
  role: UserRoles;
}

export interface ExtendedRequest extends Request {
  info?: IPayload;
}
