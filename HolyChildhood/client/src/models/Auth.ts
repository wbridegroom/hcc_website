export interface Auth {
    token: string;
    expiration: number;
    userName: string;
    fullName: string;
    roles: string[];
}
