import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ClipboardList, Plus } from 'lucide-react';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [samples, setSamples] = useState([]);
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ sample_id: '', user_id: '' });

    useEffect(() => {
        fetchAssignments();
        fetchSamples();
        fetchUsers();
    }, []);

    const fetchAssignments = async () => {
        try {
            const response = await api.get('/api/assignments');
            setAssignments(response.data);
        } catch (error) {
            console.error('Failed to fetch assignments', error);
        }
    };

    const fetchSamples = async () => {
        try {
            const response = await api.get('/api/samples');
            // Only unassigned/received samples for new assignments
            setSamples(response.data.filter(s => s.status === 'Received'));
        } catch (error) {
            console.error('Failed to fetch samples', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/api/auth/users');
            // Resident / Doctor role is usually role_id 4
            setUsers(response.data.filter(u => u.role_id === 4));
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/assignments', formData);
            setShowModal(false);
            setFormData({ sample_id: '', user_id: '' });
            fetchAssignments();
            fetchSamples(); // refresh available samples
        } catch (error) {
            console.error('Failed to create assignment', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Sample Assignments</h2>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-primary hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Plus size={18} />
                    <span>Assign Sample</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Assignment ID</th>
                                <th className="p-4 font-medium">Sample Code</th>
                                <th className="p-4 font-medium">Assigned To</th>
                                <th className="p-4 font-medium">Assignment Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map((assignment) => (
                                <tr key={assignment.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 text-slate-600">#{assignment.id}</td>
                                    <td className="p-4 font-semibold text-slate-800">{assignment.sample_code}</td>
                                    <td className="p-4 text-slate-700">Dr. {assignment.last_name} {assignment.first_name}</td>
                                    <td className="p-4 text-slate-600">{new Date(assignment.assigned_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {assignments.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500">No assignments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for creating assignment */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <ClipboardList className="text-primary"/> Assign Sample
                        </h3>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Select Sample</label>
                                <select required className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.sample_id} onChange={e => setFormData({...formData, sample_id: e.target.value})}>
                                    <option value="">Choose a sample...</option>
                                    {samples.map(s => (
                                        <option key={s.id} value={s.id}>{s.code} (Patient: {s.patient_last})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Select Resident/Doctor</label>
                                <select required className="mt-1 w-full border border-slate-300 rounded-lg p-2 focus:ring-primary focus:border-primary outline-none text-slate-700" 
                                    value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})}>
                                    <option value="">Choose a doctor...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>Dr. {u.last_name} {u.first_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-lg transition">Assign</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Assignments;
