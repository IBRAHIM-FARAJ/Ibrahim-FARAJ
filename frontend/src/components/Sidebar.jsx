import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FlaskConical, ClipboardList, LogOut, History, FileText } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = [
        { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/patients', name: 'Patients', icon: <Users size={20} /> },
        { path: '/samples', name: 'Samples', icon: <FlaskConical size={20} /> },
        { path: '/assignments', name: 'Assignments', icon: <ClipboardList size={20} /> },
        { path: '/history', name: 'History', icon: <History size={20} /> },
        { path: '/reports', name: 'Reports', icon: <FileText size={20} /> },
    ];

    return (
        <div className="w-64 bg-dark text-white flex flex-col h-full border-r border-slate-700">
            <div className="p-6 flex items-center justify-center border-b border-slate-700">
                <span className="text-2xl font-bold tracking-wider text-secondary">LabTrack</span>
            </div>
            
            <div className="flex-1 py-6 px-3 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
