import type { User } from "./user_service_types";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    isLoading: boolean;
}
