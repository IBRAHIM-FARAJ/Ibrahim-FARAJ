import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ first_name: '', last_name: '', birth_date: '', gender: 'Male' });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get('/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Failed to fetch patients', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/patients', formData);
            setShowModal(false);
            setFormData({ first_name: '', last_name: '', birth_date: '', gender: 'Male' });
            fetchPatients();
        } catch (error) {
            console.error('Failed to save patient', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;
        try {
            await api.delete(`/api/patients/${id}`);
            fetchPatients();
        } catch (error) {
            console.error('Failed to delete patient', error);
        }
    };

    const filteredPatients = patients.filter(p => 
        p.first_name.toLowerCase().includes(search.toLowerCase()) || 
        p.last_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Patients Directory</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    <span>Add Patient</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                    <Search size={20} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search patients..."
                        className="w-full focus:outline-none text-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">First Name</th>
                                <th className="p-4 font-medium">Last Name</th>
                                <th className="p-4 font-medium">Birth Date</th>
                                <th className="p-4 font-medium">Gender</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 text-slate-600">#{patient.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{patient.first_name}</td>
                                    <td className="p-4 font-medium text-slate-800">{patient.last_name}</td>
                                    <td className="p-4 text-slate-600">{new Date(patient.birth_date).toLocaleDateString()}</td>
                                    <td className="p-4 text-slate-600">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            patient.gender === 'Male' ? 'bg-blue-100 text-blue-700' : 
                                            patient.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {patient.gender}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleDelete(patient.id)} className="text-red-500 hover:text-red-700 p-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredPatients.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">No patients found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for adding patient */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Patient</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">First Name</label>
                                    <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none" 
                                        value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Last Name</label>
                                    <input required type="text" className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none" 
                                        value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Birth Date</label>
                                <input required type="date" className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Gender</label>
                                <select className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg transition">Save Patient</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
