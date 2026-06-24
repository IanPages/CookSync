import axios from "axios";
import type { UserLogin, UserLoginResponse, GoogleLoginRequest } from "../types/user_service_types";
import { API_URL_AUTH } from "./api_url_services";


export const loginUser = async ({ email, password }: UserLogin): Promise<UserLoginResponse> => {
    const response = await axios.post<UserLoginResponse>(`${API_URL_AUTH}/login`, { email, password });
    return response.data;
}

export const loginWithGoogle = async ({ id_token }: GoogleLoginRequest): Promise<UserLoginResponse> => {
    const response = await axios.post<UserLoginResponse>(`${API_URL_AUTH}/google/verify-token`, { id_token });
    return response.data;
}
