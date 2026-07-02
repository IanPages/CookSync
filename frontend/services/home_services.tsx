import axios from "axios";
import type { Home, HomeCreateRequest, HomeJoinRequest, HomeKickMember, HomeLeaveRequest, HomeMemberInfo } from "../types/home_types";
import { API_URL_HOME } from "./api_url_services";

const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const listHomes = async (): Promise<Home[]> => {
    const response = await axios.get<Home[]>(`${API_URL_HOME}/list`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const createHome = async (payload: HomeCreateRequest): Promise<Home> => {
    const response = await axios.post<Home>(`${API_URL_HOME}/create`, payload, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const joinHome = async (payload: HomeJoinRequest): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL_HOME}/join`, payload, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const leaveHome = async (payload: HomeLeaveRequest): Promise<{ message: string }> => {
    const response = await axios.post<{ message: string }>(`${API_URL_HOME}/leave`, payload,
        {
            headers: getAuthHeader(),
        });
    return response.data;
}

export const getHomeMembers = async (homeId: string): Promise<HomeMemberInfo[]> => {
    const response = await axios.get<HomeMemberInfo[]>(`${API_URL_HOME}/${homeId}/members`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

export const removeHomeMember = async (payload: HomeKickMember): Promise<{ message: string }> => {
    const response = await axios.put<{ message: string }>(`${API_URL_HOME}/kick`, payload, {
        headers: getAuthHeader(),
    });
    return response.data;
};