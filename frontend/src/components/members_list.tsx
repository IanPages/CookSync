import { useState, useEffect } from 'react';
import { getHomeMembers, removeHomeMember } from '../../services/home_services';
import type { HomeMemberInfo } from '../../types/home_types';
import { toast } from 'react-toastify';
import { useAuth } from '../context/auth_context';

interface MembersListProps {
    homeId: string;
    onBack: () => void;
}

export default function MembersList({ homeId, onBack }: MembersListProps) {
    const [members, setMembers] = useState<HomeMemberInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const isOwner = members.find((m) => m.id === user?.id)?.role === 'owner';

    const handleRemoveMember = async (memberId: string) => {
        try {
            const remove = await removeHomeMember({ home_id: homeId, user_id: memberId });
            setMembers((prev) => prev.filter((m) => m.id !== memberId));
            toast.success(remove.message);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to remove member.');
        }
    }

    useEffect(() => {
        const loadMembers = async () => {
            try {
                setLoading(true);
                const data = await getHomeMembers(homeId);
                setMembers(data);
            } catch (error: any) {
                toast.error(error.response?.data?.detail || 'Failed to load household members');
            } finally {
                setLoading(false);
            }
        };
        loadMembers();
    }, [homeId]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-cook-primary/10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cook-primary text-cook-primary hover:bg-cook-primary/20 transition-all cursor-pointer"
                    >
                        &larr; Back to Hub
                    </button>
                    <h3 className="text-xl font-bold text-cook-main">Household Members</h3>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="w-8 h-8 border-4 border-cook-primary border-t-cook-accent rounded-full animate-spin"></div>
                    <p className="text-xs text-cook-muted">Fetching members...</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="flex items-center justify-between p-4 bg-cook-bg rounded-xl border border-cook-primary/10"
                        >
                            <div className="flex items-center gap-3">
                                {member.picture ? (
                                    <img src={member.picture} alt={member.username} className="h-10 w-10 rounded-full object-cover ring-2 ring-cook-primary/10" />
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-cook-primary/10 text-cook-primary flex items-center justify-center font-bold text-sm">
                                        {member.username.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm text-cook-main leading-tight">{member.username}</p>
                                    <p className="text-xs text-cook-muted mt-0.5">{member.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${member.role === 'owner' ? 'bg-cook-accent/10 text-cook-accent' : 'bg-cook-primary/10 text-cook-primary'
                                    }`}>
                                    {member.role}
                                </span>
                                <p className="text-[10px] text-cook-muted mt-1">
                                    Joined {new Date(member.joined_at).toLocaleDateString()}
                                </p>
                                {member.id !== user?.id && member.role !== "owner" && isOwner && (
                                    <button
                                        onClick={() => handleRemoveMember(member.id)}
                                        className="mt-2 px-2 py-1 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
