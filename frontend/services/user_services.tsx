import axios from "axios";
import type { UserRegister, UserRegisterResponse, UserLogin, UserLoginResponse, GoogleLoginRequest } from "../types/user_service_types";
import { API_URL_AUTH } from "./api_url_services";


export const loginUser = async ({ email, password }: UserLogin): Promise<UserLoginResponse> => {
    const response = await axios.post<UserLoginResponse>(`${API_URL_AUTH}/login`, { email, password });
    return response.data;
}

export const loginWithGoogle = async ({ id_token }: GoogleLoginRequest): Promise<UserLoginResponse> => {
    const response = await axios.post<UserLoginResponse>(`${API_URL_AUTH}/google/verify-token`, { id_token });
    return response.data;
}

export const registerUser = async ({ username, email, password }: UserRegister): Promise<UserRegisterResponse> => {
    const response = await axios.post<UserRegisterResponse>(`${API_URL_AUTH}/register`, { username, email, password });
    return response.data;
}

export const changePassword = async (data: { old_password?: string, new_password: string }, token: string): Promise<any> => {
    const response = await axios.post(`${API_URL_AUTH}/change-password`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const getUserProfile = async (token: string): Promise<any> => {
    const response = await axios.get(`${API_URL_AUTH}/me`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}