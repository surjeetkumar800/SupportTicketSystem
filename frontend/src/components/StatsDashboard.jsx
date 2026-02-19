import React, { useState, useEffect } from 'react';
import { getStats } from '../api';

const StatsDashboard = ({ refreshTrigger }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await getStats();
                setStats(data);
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };
        fetchStats();
    }, [refreshTrigger]);

    if (!stats) return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/50 rounded-2xl w-full"></div>)}
        </div>
    );

    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold text-surface-800 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Metric Card 1 */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-surface-500 text-sm font-medium uppercase tracking-wider">Total Tickets</p>
                        <h3 className="text-4xl font-extrabold text-brand-900 mt-2">{stats.total_tickets}</h3>
                    </div>
                </div>

                {/* Metric Card 2 */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-surface-500 text-sm font-medium uppercase tracking-wider">Active Issues</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-4xl font-extrabold text-emerald-600">{stats.open_tickets}</h3>
                            <span className="text-sm text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">Open</span>
                        </div>
                    </div>
                </div>

                {/* Metric Card 3 */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                    <div className="relative z-10">
                        <p className="text-surface-500 text-sm font-medium uppercase tracking-wider">Velocity</p>
                        <div className="flex items-baseline gap-2 mt-2">
                            <h3 className="text-4xl font-extrabold text-accent-500">{stats.avg_tickets_per_day}</h3>
                            <span className="text-sm text-surface-400">/ day</span>
                        </div>
                    </div>
                </div>

                {/* Priority Breakdown Mini-Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-soft border border-surface-100 flex flex-col justify-center">
                    <div className="space-y-3">
                        {Object.entries(stats.priority_breakdown).length > 0 ? Object.entries(stats.priority_breakdown).map(([key, val]) => (
                            <div key={key} className="flex items-center text-sm">
                                <span className="w-20 capitalize text-surface-600 font-medium">{key}</span>
                                <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden mx-2">
                                    <div
                                        className={`h-full rounded-full ${key === 'critical' ? 'bg-red-500' : key === 'high' ? 'bg-orange-400' : key === 'medium' ? 'bg-blue-400' : 'bg-surface-400'}`}
                                        style={{ width: `${(val / stats.total_tickets) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-surface-900 font-bold w-6 text-right">{val}</span>
                            </div>
                        )) : <span className="text-surface-400 text-sm italic">No data available</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
