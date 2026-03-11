import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FlaskConical, CheckCircle2, FlaskRound, ListTodo } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center space-x-4 hover:shadow-md transition">
        <div className={`p-4 rounded-full ${colorClass} bg-opacity-10 text-${colorClass.split('-')[1]}-600`}>
            {<Icon size={24} />}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, today: 0, enAnalyse: 0, resultatPret: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="text-slate-500 p-8 text-center">Loading dashboard...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Tableau de Bord</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Prélèvements" value={stats.total} icon={ListTodo} colorClass="bg-blue-500 text-blue-600" />
                <StatCard title="Reçus Aujourd'hui" value={stats.today} icon={FlaskRound} colorClass="bg-purple-500 text-purple-600" />
                <StatCard title="En Analyse" value={stats.enAnalyse} icon={FlaskConical} colorClass="bg-amber-500 text-amber-600" />
                <StatCard title="Résultat Prêt" value={stats.resultatPret} icon={CheckCircle2} colorClass="bg-emerald-500 text-emerald-600" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Activité Récente</h3>
                <p className="text-slate-500">Naviguez vers l'Historique pour voir les traces détaillées.</p>
            </div>
        </div>
    );
};

export default Dashboard;
