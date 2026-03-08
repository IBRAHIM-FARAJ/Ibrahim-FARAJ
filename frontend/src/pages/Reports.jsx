import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Download } from 'lucide-react';

const Reports = () => {
    const [stats, setStats] = useState({ total: 0, today: 0, inAnalysis: 0, completed: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/api/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            }
        };
        fetchStats();
    }, []);

    const handleExport = () => {
        // Mock export functionality
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Report Type,Count\n"
            + `Total Samples,${stats.total}\n`
            + `Received Today,${stats.today}\n`
            + `In Analysis,${stats.inAnalysis}\n`
            + `Completed,${stats.completed}\n`;
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "laboratory_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FileText className="text-purple-600" /> Laboratory Reports
                </h2>
                <button 
                    onClick={handleExport}
                    className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition"
                >
                    <Download size={18} />
                    <span>Export CSV</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b pb-2">Status Distribution</h3>
                <div className="space-y-4 max-w-lg">
                    <div className="flex justify-between items-center text-sm font-medium text-slate-700">
                        <span>Available Total Samples</span>
                        <span>{stats.total}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium text-slate-700 pt-4">
                        <span>Completed</span>
                        <span>{stats.completed}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.completed/stats.total)*100 : 0}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium text-slate-700 pt-4">
                        <span>In Analysis</span>
                        <span>{stats.inAnalysis}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.inAnalysis/stats.total)*100 : 0}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-sm font-medium text-slate-700 pt-4">
                        <span>Received Today</span>
                        <span>{stats.today}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${stats.total > 0 ? (stats.today/stats.total)*100 : 0}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
