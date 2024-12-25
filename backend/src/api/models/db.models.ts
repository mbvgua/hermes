
export interface SqlConfig {
    user?:string,
    database?:string,
    password?:string,
    waitForConnections: boolean,
    connectionLimit: number,
    maxIdle: number,
    idleTimeout: number, 
    queueLimit: number,
    enableKeepAlive: boolean,
    keepAliveInitialDelay: number,
}