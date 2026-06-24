export interface UserLogin {
    email: string;
    password: string;
}

export interface UserLoginResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        username: string;
        email: string;
        picture: string | null;
    }
}

export interface GoogleLoginRequest {
    id_token: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    picture: string | null;
}