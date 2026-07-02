export interface Home {
    id: string;
    name: string;
    invite_code: string;
    created_at: string;
    owner_id: string;
}

export interface HomeCreateRequest {
    name: string;
}

export interface HomeJoinRequest {
    invite_code: string;
}

export interface HomeLeaveRequest {
    home_id: string;
}

export interface HomeMemberInfo {
    id: string;
    username: string;
    email: string;
    picture: string | null;
    role: string;
    joined_at: string;
}

export interface HomeKickMember {
    home_id: string;
    user_id: string;
}