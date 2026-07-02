import { useState, useEffect } from 'react';
import { useAuth } from '../context/auth_context';
import { listHomes, createHome, joinHome, leaveHome } from '../../services/home_services';
import type { Home } from '../../types/home_types';
import MembersList from './members_list';
import { toast } from 'react-toastify';
import {
    HomeIcon,
    PlusIcon,
    UserPlusIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentCheckIcon,
    ArrowRightOnRectangleIcon,
    ShoppingCartIcon,
    SparklesIcon,
    CalendarIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

export default function Household() {
    const { isLoggedIn, isLoading: authLoading, user } = useAuth();
    const [homes, setHomes] = useState<Home[]>([]);
    const [selectedHome, setSelectedHome] = useState<Home | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [newHomeName, setNewHomeName] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [isSubmittingJoin, setIsSubmittingJoin] = useState(false);

    // Sub-view management
    const [activeSubView, setActiveSubView] = useState<'overview' | 'members'>('overview');

    const fetchHouseholds = async () => {
        try {
            setLoading(true);
            const data = await listHomes();
            setHomes(data);
            if (data.length > 0 && !selectedHome) {
                setSelectedHome(data[0]);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to load households');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchHouseholds();
        }
    }, [isLoggedIn]);

    // Reset view when selected household changes
    useEffect(() => {
        setActiveSubView('overview');
    }, [selectedHome]);

    const handleCreateHome = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newHomeName.trim()) return;
        try {
            setIsSubmittingCreate(true);
            const newHome = await createHome({ name: newHomeName.trim() });
            toast.success(`Successfully created ${newHome.name}!`);
            setNewHomeName('');
            const updatedHomes = await listHomes();
            setHomes(updatedHomes);
            setSelectedHome(newHome);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to create household');
        } finally {
            setIsSubmittingCreate(false);
        }
    };

    const handleJoinHome = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;
        try {
            setIsSubmittingJoin(true);
            await joinHome({ invite_code: inviteCode.trim() });
            toast.success('Successfully joined the household!');
            setInviteCode('');
            const updatedHomes = await listHomes();
            setHomes(updatedHomes);
            // Select the joined household (usually the last one or by finding name)
            if (updatedHomes.length > 0) {
                setSelectedHome(updatedHomes[updatedHomes.length - 1]);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to join household');
        } finally {
            setIsSubmittingJoin(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Invite code copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLeaveHome = async () => {
        if (selectedHome?.id) {
            await leaveHome({ home_id: selectedHome.id });
            toast.success('Successfully left the household!');
            const updatedHomes = await listHomes();
            setHomes(updatedHomes);
            setSelectedHome(null);
        } else {
            toast.error('No household selected to leave.');
        }
    }

    if (authLoading || (isLoggedIn && loading)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-cook-primary border-t-cook-accent rounded-full animate-spin"></div>
                <p className="text-cook-muted font-medium animate-pulse">Loading your kitchen...</p>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="max-w-md mx-auto my-12 text-center p-8 bg-cook-surface rounded-2xl border border-cook-primary/10 shadow-lg space-y-6">
                <HomeIcon className="size-16 mx-auto text-cook-accent/80" />
                <h2 className="text-2xl font-bold text-cook-main">Access Denied</h2>
                <p className="text-cook-muted">Please log in or register to manage and join shared households.</p>
                <a
                    href="/login"
                    className="inline-block w-full px-6 py-3 bg-cook-primary text-white font-semibold rounded-xl hover:bg-cook-accent transition-colors"
                >
                    Go to Login
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cook-primary/10 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-cook-main tracking-tight">Your Households</h1>
                    <p className="text-cook-muted">Manage, share, and switch between your synchronized kitchen workspaces.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Households List & Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-cook-surface/50 p-6 rounded-2xl border border-cook-primary/10 space-y-4">
                        <h2 className="text-lg font-bold text-cook-main flex items-center gap-2">
                            <HomeIcon className="size-5 text-cook-accent" />
                            Active Households ({homes.length})
                        </h2>

                        {homes.length === 0 ? (
                            <p className="text-sm text-cook-muted py-4 text-center bg-cook-surface/20 rounded-xl">
                                You are not in any household yet. Create or join one below!
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {homes.map((home) => {
                                    const isSelected = selectedHome?.id === home.id;
                                    return (
                                        <button
                                            key={home.id}
                                            onClick={() => setSelectedHome(home)}
                                            className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between group cursor-pointer ${isSelected
                                                ? 'bg-cook-primary text-white border-cook-primary shadow-md shadow-cook-primary/15'
                                                : 'bg-cook-surface text-cook-main border-cook-primary/10 hover:border-cook-primary/40 hover:bg-cook-surface/80'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-cook-primary/10 text-cook-primary'}`}>
                                                    <HomeIcon className="size-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm leading-tight">{home.name}</p>
                                                    <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-cook-muted'}`}>
                                                        Code: {home.invite_code}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={`transition-transform duration-300 ${isSelected ? 'translate-x-0' : 'group-hover:translate-x-1'}`}>
                                                &rarr;
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Create Household Form */}
                    <div className="bg-cook-surface/50 p-6 rounded-2xl border border-cook-primary/10 space-y-4">
                        <h3 className="font-bold text-cook-main flex items-center gap-2">
                            <PlusIcon className="size-5 text-cook-primary" />
                            Create a Household
                        </h3>
                        <form onSubmit={handleCreateHome} className="space-y-3">
                            <input
                                type="text"
                                placeholder="e.g. My Cozy Kitchen"
                                value={newHomeName}
                                onChange={(e) => setNewHomeName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-cook-primary/20 focus:outline-none focus:border-cook-accent transition-all text-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingCreate}
                                className="w-full py-2.5 rounded-xl font-semibold bg-cook-primary hover:bg-cook-accent text-white text-sm transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingCreate ? 'Creating...' : 'Create Kitchen'}
                            </button>
                        </form>
                    </div>

                    {/* Join Household Form */}
                    <div className="bg-cook-surface/50 p-6 rounded-2xl border border-cook-primary/10 space-y-4">
                        <h3 className="font-bold text-cook-main flex items-center gap-2">
                            <UserPlusIcon className="size-5 text-cook-primary" />
                            Join with Invite Code
                        </h3>
                        <form onSubmit={handleJoinHome} className="space-y-3">
                            <input
                                type="text"
                                placeholder="Invite Code (e.g. K3JH8923LA)"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-cook-primary/20 focus:outline-none focus:border-cook-accent transition-all text-sm uppercase"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmittingJoin}
                                className="w-full py-2.5 rounded-xl font-semibold bg-cook-primary hover:bg-cook-accent text-white text-sm transition-all flex items-center justify-center gap-2"
                            >
                                {isSubmittingJoin ? 'Joining...' : 'Join Kitchen'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Selected Household Detail View */}
                <div className="lg:col-span-8">
                    {selectedHome ? (
                        <div className="bg-cook-surface rounded-2xl p-6 md:p-8 border border-cook-primary/10 space-y-8 shadow-xs">
                            {/* Detail Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-cook-primary/10">
                                <div>
                                    <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-cook-accent/10 text-cook-accent rounded-full mb-2">
                                        Active Kitchen Workspace
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-extrabold text-cook-main">{selectedHome.name}</h2>
                                    <p className="text-xs text-cook-muted mt-1">
                                        Created on {new Date(selectedHome.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 bg-cook-bg px-4 py-2.5 rounded-xl border border-cook-primary/10">
                                    <div className="text-left">
                                        <p className="text-[10px] text-cook-muted uppercase font-bold tracking-wider">Invite Code</p>
                                        <p className="font-mono font-bold text-cook-accent text-sm tracking-wider">{selectedHome.invite_code}</p>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(selectedHome.invite_code)}
                                        className="p-1.5 rounded-lg bg-cook-primary hover:bg-cook-primary/10 text-cook-muted hover:text-cook-accent transition-all"
                                    >
                                        {copied ? (
                                            <ClipboardDocumentCheckIcon className="size-5 text-green-600" />
                                        ) : (
                                            <ClipboardDocumentIcon className="size-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Sub-view switcher */}
                            {activeSubView === 'members' ? (
                                <MembersList homeId={selectedHome.id} onBack={() => setActiveSubView('overview')} />
                            ) : (
                                <>
                                    {/* Next Phase Placeholders section */}
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-cook-main">Kitchen Hub Features</h3>
                                            <p className="text-sm text-cook-muted">These modules will be fully interactive once fully designed.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Feature Placeholder 1: Shared Pantry & Grocery */}
                                            <div className="p-5 bg-cook-bg rounded-xl border border-cook-primary/10 hover:border-cook-primary/30 transition-all duration-300 group">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="p-2 rounded-lg bg-cook-accent/10 text-cook-accent group-hover:scale-110 transition-transform">
                                                        <ShoppingCartIcon className="size-6" />
                                                    </div>
                                                    <span className="text-[10px] bg-cook-accent/15 text-cook-accent px-2 py-0.5 rounded-full font-bold">Planned</span>
                                                </div>
                                                <h4 className="font-bold text-cook-main text-base">Grocery & Pantry Sync</h4>
                                                <p className="text-xs text-cook-muted mt-1 leading-relaxed">
                                                    Add ingredients, synchronize your shopping list with other household members, and keep track of stock.
                                                </p>
                                            </div>

                                            {/* Feature Placeholder 2: Recipe Planner */}
                                            <div className="p-5 bg-cook-bg rounded-xl border border-cook-primary/10 hover:border-cook-primary/30 transition-all duration-300 group">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="p-2 rounded-lg bg-cook-primary/10 text-cook-primary group-hover:scale-110 transition-transform">
                                                        <CalendarIcon className="size-6" />
                                                    </div>
                                                    <span className="text-[10px] bg-cook-primary/15 text-cook-primary px-2 py-0.5 rounded-full font-bold">Planned</span>
                                                </div>
                                                <h4 className="font-bold text-cook-main text-base">Shared Recipe Planner</h4>
                                                <p className="text-xs text-cook-muted mt-1 leading-relaxed">
                                                    Plan meals for the week, link recipes to your planner, and automatically add missing ingredients to the grocery list.
                                                </p>
                                            </div>

                                            {/* Feature Placeholder 3: AI Sous Chef */}
                                            <div className="p-5 bg-cook-bg rounded-xl border border-cook-primary/10 hover:border-cook-primary/30 transition-all duration-300 group">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="p-2 rounded-lg bg-cook-accent/10 text-cook-accent group-hover:scale-110 transition-transform">
                                                        <SparklesIcon className="size-6" />
                                                    </div>
                                                    <span className="text-[10px] bg-cook-accent/15 text-cook-accent px-2 py-0.5 rounded-full font-bold">Planned</span>
                                                </div>
                                                <h4 className="font-bold text-cook-main text-base">AI Kitchen Assistant</h4>
                                                <p className="text-xs text-cook-muted mt-1 leading-relaxed">
                                                    Chat with an AI companion that suggests recipes based on your pantry stock and remembers your favorites.
                                                </p>
                                            </div>

                                            {/* Feature: House Members */}
                                            <button
                                                onClick={() => setActiveSubView('members')}
                                                className="text-left w-full p-5 bg-cook-bg rounded-xl border border-cook-primary/10 hover:border-cook-primary transition-all duration-300 group cursor-pointer hover:shadow-xs"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="p-2 rounded-lg bg-cook-primary/10 text-cook-primary  group-hover:scale-110 transition-transform">
                                                        <UserGroupIcon className="size-6" />
                                                    </div>
                                                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Active</span>
                                                </div>
                                                <h4 className="font-bold text-cook-main text-base">Member Management</h4>
                                                <p className="text-xs text-cook-muted mt-1 leading-relaxed">
                                                    See who is in the household, assign cooking tasks, and manage admin privileges.
                                                </p>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Danger Zone Actions */}
                                    <div className="pt-6 border-t border-cook-primary/10 flex flex-wrap gap-4 items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-bold text-cook-main">Kitchen Workspace Actions</h4>
                                            <p className="text-xs text-cook-muted">Leave or manage settings for this specific kitchen workspace.</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    handleLeaveHome();
                                                }}
                                                className="flex items-center gap-1.5 px-4 py-2 bg-cook-primary hover:bg-cook-accent/10 border border-cook-accent/20 hover:border-cook-accent text-cook-accent rounded-xl text-xs font-semibold transition-all cursor-pointer"
                                            >
                                                <ArrowRightOnRectangleIcon className="size-4" />
                                                Leave Household
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="bg-cook-surface rounded-2xl p-12 border border-cook-primary/10 text-center space-y-4">
                            <HomeIcon className="size-16 mx-auto text-cook-primary/40 animate-bounce" />
                            <h2 className="text-xl font-bold text-cook-main">No Household Selected</h2>
                            <p className="text-cook-muted max-w-sm mx-auto text-sm">
                                Select a household from the left list, or create/join one to activate a shared kitchen workspace.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
