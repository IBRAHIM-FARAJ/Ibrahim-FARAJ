import React from 'react';
import { User } from 'lucide-react';

const Topbar = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-10">
            <h2 className="text-xl font-semibold text-slate-800">Laboratory Sample Management</h2>
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-600 text-sm">
                    <span className="font-medium">Role ID: {user?.role_id}</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-4 py-2 hover:bg-slate-200 transition cursor-pointer">
                    <User size={18} className="text-primary" />
                    <span className="font-medium text-slate-700">{user?.first_name} {user?.last_name}</span>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
