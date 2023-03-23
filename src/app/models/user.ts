export interface User {
    id?: string | number;
    first_name: string;
    last_name: string;
    user_name: string;
    password: string;
}

export interface SignedInUser {
    token: string,
    userId: string,
    userName: string
}