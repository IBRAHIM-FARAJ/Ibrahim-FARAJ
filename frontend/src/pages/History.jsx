import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History as HistoryIcon, Search } from 'lucide-react';

const History = () => {
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/dashboard/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    const filteredHistory = history.filter(h => 
        h.sample_code.toLowerCase().includes(search.toLowerCase()) || 
        h.action.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <HistoryIcon className="text-secondary" /> Traceability History
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center space-x-2">
                    <Search size={20} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search by sample code or action..."
                        className="w-full focus:outline-none text-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                                <th className="p-4 font-medium">Log ID</th>
                                <th className="p-4 font-medium">Sample Code</th>
                                <th className="p-4 font-medium">User Action</th>
                                <th className="p-4 font-medium">Performed By</th>
                                <th className="p-4 font-medium">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="p-4 text-slate-500 text-sm">#{item.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{item.sample_code}</td>
                                    <td className="p-4 text-slate-700">{item.action}</td>
                                    <td className="p-4 text-slate-600">{item.first_name} {item.last_name}</td>
                                    <td className="p-4 text-slate-500 text-sm">{new Date(item.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-500">No history records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
