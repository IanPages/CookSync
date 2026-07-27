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
    created_at?: string;
}

export interface UserRegister {
    username: string;
    email: string;
    password: string;
}


export interface UserRegisterResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        username: string;
        email: string;

    }
}

export interface ChangePasswordRequest {
    old_password?: string;
    new_password: string;
}