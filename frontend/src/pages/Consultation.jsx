import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search } from 'lucide-react';

const Consultation = () => {
    const [samples, setSamples] = useState([]);
    const [teams, setTeams] = useState([]);
    const [filterRef, setFilterRef] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterTeam, setFilterTeam] = useState('');

    useEffect(() => {
        fetchSamples();
        fetchTeams();
    }, []);

    const fetchSamples = async () => {
        try {
            const response = await api.get('/api/samples');
            setSamples(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchTeams = async () => {
        try {
            const response = await api.get('/api/samples/teams/all');
            setTeams(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const filteredSamples = samples.filter(s => {
        const matchRef = filterRef === '' || s.reference.toLowerCase().includes(filterRef.toLowerCase());
        const matchDate = filterDate === '' || (s.date_reception && new Date(s.date_reception).toLocaleDateString('en-CA') === filterDate);
        const matchTeam = filterTeam === '' || s.team_name === filterTeam;
        return matchRef && matchDate && matchTeam;
    });

    const getStatusBadge = (status) => {
        switch(status) {
            case 'En attente': return <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">{status}</span>;
            case 'Assigné': return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">{status}</span>;
            case 'En analyse': return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">{status}</span>;
            case 'Résultat prêt': return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold">{status}</span>;
            default: return <span>{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Consultation Résidents</h2>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50">
                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Filtrer par référence..." className="w-full bg-transparent focus:outline-none text-sm text-slate-700" value={filterRef} onChange={(e) => setFilterRef(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                        <span className="text-slate-400 text-sm ml-1">Date:</span>
                        <input type="date" className="w-full bg-transparent focus:outline-none text-sm text-slate-700" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                        <select className="w-full bg-transparent focus:outline-none text-sm text-slate-700 cursor-pointer" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                            <option value="">Toutes les équipes</option>
                            {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Référence</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Nombre</th>
                                <th className="p-4 font-medium">Équipe</th>
                                <th className="p-4 font-medium">Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.map((s) => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 font-bold text-slate-800">{s.reference}</td>
                                    <td className="p-4 text-slate-600">{new Date(s.date_reception).toLocaleDateString()}</td>
                                    <td className="p-4 text-slate-700">{s.type}</td>
                                    <td className="p-4 text-slate-700">{s.nombre}</td>
                                    <td className="p-4 font-medium text-slate-800">{s.team_name || '-'}</td>
                                    <td className="p-4">{getStatusBadge(s.status)}</td>
                                </tr>
                            ))}
                            {filteredSamples.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-10 text-center text-slate-500">Aucun résultat trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* Note the explicit lack of "Actions" column or Edit buttons, matching the read-only spec */}
        </div>
    );
};

export default Consultation;
