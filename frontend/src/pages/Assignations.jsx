import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Edit } from 'lucide-react';

const Assignations = () => {
    const [samples, setSamples] = useState([]);
    const [teams, setTeams] = useState([]);
    const [filterRef, setFilterRef] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [filterTeam, setFilterTeam] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null);
    const [statusData, setStatusData] = useState({ status: '', team_id: '' });

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

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/samples/${selectedSample.id}/status`, {
                status: statusData.status,
                team_id: statusData.team_id === '' ? null : statusData.team_id
            });
            setShowModal(false);
            fetchSamples();
        } catch (error) {
            alert('Erreur lors de la mise à jour');
        }
    };

    const filteredSamples = samples.filter(s => {
        const matchRef = filterRef === '' || s.reference.toLowerCase().includes(filterRef.toLowerCase());
        const matchDate = filterDate === '' || (s.date_reception && new Date(s.date_reception).toLocaleDateString('en-CA') === filterDate);
        const matchTeam = filterTeam === '' || s.team_name === filterTeam;
        return matchRef && matchDate && matchTeam;
    });

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Assignation et Équipes</h2>

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
                                <th className="p-4 font-medium">Équipe assignée</th>
                                <th className="p-4 font-medium">Statut actuel</th>
                                <th className="p-4 font-medium text-right">Modifier assignation/statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.map((s) => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 font-semibold text-slate-800">{s.reference}</td>
                                    <td className="p-4 text-slate-600">{new Date(s.date_reception).toLocaleDateString()}</td>
                                    <td className="p-4 font-medium text-blue-700">{s.team_name || 'Non assigné'}</td>
                                    <td className="p-4 font-medium text-slate-600">{s.status}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedSample(s);
                                                setStatusData({ status: s.status, team_id: s.team_id || '' });
                                                setShowModal(true);
                                            }}
                                            className="text-secondary hover:text-blue-700 p-2 rounded-lg flex items-center justify-end w-full space-x-2"
                                        >
                                            <Edit size={16} /> <span>Gérer</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedSample && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Assigner: {selectedSample.reference}</h3>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Assigner à l'équipe</label>
                                <select className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary outline-none" 
                                    value={statusData.team_id} onChange={e => setStatusData({...statusData, team_id: e.target.value})}>
                                    <option value="">-- Aucune équipe --</option>
                                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Mettre à jour le statut</label>
                                <select className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary outline-none" 
                                    value={statusData.status} onChange={e => setStatusData({...statusData, status: e.target.value})}>
                                    <option>En attente</option>
                                    <option>Assigné</option>
                                    <option>En analyse</option>
                                    <option>Résultat prêt</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignations;
