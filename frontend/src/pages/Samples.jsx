import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Edit } from 'lucide-react';

const Samples = () => {
    const [samples, setSamples] = useState([]);
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedSample, setSelectedSample] = useState(null);
    const [formData, setFormData] = useState({ patient_id: '', date_received: '' });
    const [statusData, setStatusData] = useState({ status: '' });

    useEffect(() => {
        fetchSamples();
        fetchPatients();
    }, []);

    const fetchSamples = async () => {
        try {
            const response = await api.get('/api/samples');
            setSamples(response.data);
        } catch (error) {
            console.error('Failed to fetch samples', error);
        }
    };

    const fetchPatients = async () => {
        try {
            const response = await api.get('/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Failed to fetch patients', error);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/samples', formData);
            setShowCreateModal(false);
            setFormData({ patient_id: '', date_received: '' });
            fetchSamples();
        } catch (error) {
            console.error('Failed to create sample', error);
        }
    };

    const handleUpdateStatus = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/samples/${selectedSample.id}`, statusData);
            setShowStatusModal(false);
            setSelectedSample(null);
            fetchSamples();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const filteredSamples = samples.filter(s => 
        s.code.toLowerCase().includes(search.toLowerCase()) || 
        (s.patient_first + ' ' + s.patient_last).toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch(status) {
            case 'Received': return 'bg-slate-100 text-slate-700';
            case 'Assigned': return 'bg-blue-100 text-blue-700';
            case 'In Analysis': return 'bg-amber-100 text-amber-700';
            case 'Completed': return 'bg-emerald-100 text-emerald-700';
            case 'Archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Laboratory Samples</h2>
                <button 
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    <span>Register Sample</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                    <Search size={20} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by code or patient..."
                        className="w-full focus:outline-none text-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Sample Code</th>
                                <th className="p-4 font-medium">Patient</th>
                                <th className="p-4 font-medium">Date Received</th>
                                <th className="p-4 font-medium">Status</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSamples.map((sample) => (
                                <tr key={sample.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 font-semibold text-slate-800">{sample.code}</td>
                                    <td className="p-4 text-slate-700">{sample.patient_first} {sample.patient_last}</td>
                                    <td className="p-4 text-slate-600">{new Date(sample.date_received).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(sample.status)}`}>
                                            {sample.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => {
                                                setSelectedSample(sample);
                                                setStatusData({ status: sample.status });
                                                setShowStatusModal(true);
                                            }}
                                            className="text-secondary hover:text-blue-700 p-1 flex items-center justify-end w-full space-x-1"
                                        >
                                            <Edit size={16} /> <span>Update</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSamples.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No samples found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for creating sample */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Register New Sample</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Patient</label>
                                <select required className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                                    <option value="">Select a patient...</option>
                                    {patients.map(p => (
                                        <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Date Received</label>
                                <input required type="date" className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.date_received} onChange={e => setFormData({...formData, date_received: e.target.value})} />
                            </div>
                            
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg transition">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal for updating status */}
            {showStatusModal && selectedSample && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Update Status: {selectedSample.code}</h3>
                        <form onSubmit={handleUpdateStatus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">New Status</label>
                                <select required className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={statusData.status} onChange={e => setStatusData({ status: e.target.value })}>
                                    <option>Received</option>
                                    <option>Assigned</option>
                                    <option>In Analysis</option>
                                    <option>Completed</option>
                                    <option>Archived</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowStatusModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg transition">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Samples;
