import React, { useState } from 'react';
import { useAuth } from '../context/auth_context';
import { KeyIcon, CalendarIcon, EnvelopeIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ChangePasswordModal from './modals/change_password_modal';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);


    if (!user) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-white text-lg">Please log in to view your profile.</p>
            </div>
        );
    }



    const handleLogout = () => {
        logout();
        navigate('/');
    };
    const parsedDate = user.created_at ? new Date(user.created_at + (!user.created_at.endsWith('Z') && user.created_at.includes('T') ? 'Z' : '')) : null;
    const formattedDate = parsedDate && !isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'Unknown';

    return (
        <div className="max-w-3xl mx-auto mt-10">
            <h1 className="text-3xl font-bold text-cook-primary mb-8">Your Profile</h1>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl shadow-cook-accent/20 overflow-hidden border border-white/20">
                <div className="bg-gradient-to-r from-cook-primary to-cook-accent h-32"></div>

                <div className="px-8 pb-8 relative">
                    {/* Profile Picture */}
                    <div className="relative -top-16 flex justify-between items-end">
                        <div className="h-32 w-32 rounded-full border-4 border-cook-bg bg-cook-bg flex items-center justify-center overflow-hidden shadow-lg">
                            {user.picture ? (
                                <img src={user.picture} alt={user.username} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-5xl font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mb-4 flex items-center gap-2 bg-cook-primary text-white px-4 py-2 rounded-lg transition-colors border border-white/10"
                        >
                            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                            Log out
                        </button>
                    </div>

                    {/* User Info */}
                    <div className="-mt-8">
                        <h2 className="text-3xl font-bold text-cook-primary">{user.username}</h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="bg-cook-accent/20 p-3 rounded-lg text-cook-accent">
                                    <EnvelopeIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-cook-accent ">Email Address</p>
                                    <p className="text-cook-primary font-medium truncate">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="bg-cook-accent/20 p-3 rounded-lg text-cook-accent">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-cook-accent">Member Since</p>
                                    <p className="text-cook-primary font-medium">{formattedDate}</p>
                                </div>
                            </div>

                        </div>

                        {/* Actions */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <h3 className="text-xl font-semibold text-cook-accent mb-4">Security</h3>
                            <button
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="flex items-center gap-2 bg-cook-primary hover:bg-cook-accent text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg hover:shadow-cook-accent/50"
                            >
                                <KeyIcon className="h-5 w-5" />
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
        </div>
    );
};

export default Profile;
