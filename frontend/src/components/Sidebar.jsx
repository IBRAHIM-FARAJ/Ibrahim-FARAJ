import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, FlaskConical, ClipboardList, LogOut, History, FileText } from 'lucide-react';

const Sidebar = () => {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserRole(JSON.parse(storedUser).role_id);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // roles map: 1=Admin, 2=Sec1, 3=Sec2, 4=Resident
    const navItems = [
        { path: '/', name: 'Tableau de bord', icon: <LayoutDashboard size={20} />, allowedRoles: [1, 2, 3, 4] },
        { path: '/reception', name: 'Réception', icon: <FlaskConical size={20} />, allowedRoles: [1, 2] },
        { path: '/assignations', name: 'Assignation', icon: <ClipboardList size={20} />, allowedRoles: [1, 3] },
        { path: '/consultation', name: 'Consultation', icon: <Users size={20} />, allowedRoles: [1, 4] },
        { path: '/history', name: 'Historique', icon: <History size={20} />, allowedRoles: [1] },
    ];

    const filteredNavItems = navItems.filter(item => userRole && item.allowedRoles.includes(userRole));

    return (
        <div className="w-64 bg-dark text-white flex flex-col h-full border-r border-slate-700">
            <div className="p-6 flex items-center justify-center border-b border-slate-700">
                <span className="text-2xl font-bold tracking-wider text-secondary">LabTrack</span>
            </div>
            
            <div className="flex-1 py-6 px-3 space-y-2">
                {filteredNavItems.map((item) => (
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
                    <span className="font-medium">Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
