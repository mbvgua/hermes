
export interface Users {
    id:string,
    username:string,
    email:string,
    password:string,
    role:string
}

export enum UserRoles {
    Customer = 'customer',
    Admin = 'admin'
}