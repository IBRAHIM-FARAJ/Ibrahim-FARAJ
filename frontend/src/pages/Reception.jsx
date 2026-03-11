import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';

const Reception = () => {
    const [samples, setSamples] = useState([]);
    const [filterRef, setFilterRef] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [formData, setFormData] = useState({ 
        reference: '', patient_reference: '', type: 'Biopsie', service: '', date_reception: '', nombre: 1 
    });
    const [error, setError] = useState('');

    useEffect(() => { fetchSamples(); }, []);

    const fetchSamples = async () => {
        try {
            const response = await api.get('/api/samples');
            setSamples(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isEditing) {
                await api.put(`/api/samples/${selectedId}`, formData);
            } else {
                await api.post('/api/samples', formData);
            }
            setShowModal(false);
            fetchSamples();
        } catch (error) {
            setError(error.response?.data?.error || 'Une erreur est survenue');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce prélèvement ?')) return;
        try {
            await api.delete(`/api/samples/${id}`);
            fetchSamples();
        } catch (error) {
            alert(error.response?.data?.error || 'Erreur lors de la suppression');
        }
    };

    const openEditModal = (sample) => {
        setFormData({
            reference: sample.reference,
            patient_reference: sample.patient_reference,
            type: sample.type,
            service: sample.service,
            date_reception: sample.date_reception ? new Date(sample.date_reception).toLocaleDateString('en-CA') : '',
            nombre: sample.nombre
        });
        setSelectedId(sample.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const filteredSamples = samples.filter(s => {
        const matchRef = filterRef === '' || s.reference.toLowerCase().includes(filterRef.toLowerCase());
        const matchDate = filterDate === '' || (s.date_reception && new Date(s.date_reception).toLocaleDateString('en-CA') === filterDate);
        return matchRef && matchDate;
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
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Réception des prélèvements</h2>
                <button 
                    onClick={() => {
                        setIsEditing(false);
                        setFormData({ reference: '', patient_reference: '', type: 'Biopsie', service: '', date_reception: '', nombre: 1 });
                        setShowModal(true);
                    }}
                    className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    <span>Nouveau prélèvement</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50">
                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                        <Search size={18} className="text-slate-400" />
                        <input type="text" placeholder="Filtrer par référence..." className="w-full bg-transparent focus:outline-none text-sm text-slate-700" value={filterRef} onChange={(e) => setFilterRef(e.target.value)} />
                    </div>
                    <div className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                        <span className="text-slate-400 text-sm ml-1">Date:</span>
                        <input type="date" className="w-full bg-transparent focus:outline-none text-sm text-slate-700" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Référence</th>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Service</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Nombre</th>
                                <th className="p-4 font-medium">Statut</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.map((s) => (
                                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 font-semibold text-slate-800">{s.reference}</td>
                                    <td className="p-4 text-slate-700">{s.type}</td>
                                    <td className="p-4 text-slate-700">{s.service}</td>
                                    <td className="p-4 text-slate-600">{new Date(s.date_reception).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-slate-700">{s.nombre}</td>
                                    <td className="p-4">{getStatusBadge(s.status)}</td>
                                    <td className="p-4 text-right flex justify-end space-x-2">
                                        {s.status === 'En attente' ? (
                                            <>
                                                <button onClick={() => openEditModal(s)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 size={16} /></button>
                                            </>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic">Verrouillé</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">{isEditing ? 'Modifier prélèvement' : 'Nouveau prélèvement'}</h3>
                        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div><label>Référence (ex: B2020)</label><input required className="input-field" value={formData.reference} onChange={e => setFormData({...formData, reference: e.target.value})} /></div>
                            <div><label>Référence patient</label><input required className="input-field" value={formData.patient_reference} onChange={e => setFormData({...formData, patient_reference: e.target.value})} /></div>
                            <div>
                                <label>Type</label>
                                <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option>Biopsie</option><option>Cytologie</option><option>Pièce opératoire</option>
                                </select>
                            </div>
                            <div><label>Service demandeur</label><input required className="input-field" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} /></div>
                            <div><label>Date de réception</label><input required type="date" className="input-field" value={formData.date_reception} onChange={e => setFormData({...formData, date_reception: e.target.value})} /></div>
                            <div><label>Nombre de prélèvements</label><input required type="number" min="1" className="input-field" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} /></div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Annuler</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg">{isEditing ? 'Mettre à jour' : 'Ajouter'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style jsx="true">{`
                .input-field { width: 100%; border: 1px solid #cbd5e1; border-radius: 0.5rem; padding: 0.5rem; margin-top: 0.25rem; outline: none; }
                .input-field:focus { border-color: #2563eb; ring: 2px solid #2563eb; }
                label { display: block; font-size: 0.875rem; font-weight: 500; color: #334155; }
            `}</style>
        </div>
    );
};

export default Reception;
