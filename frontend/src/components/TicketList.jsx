import React, { useState, useEffect } from 'react';
import { getTickets, updateTicket } from '../api';

const TicketList = ({ refreshTrigger }) => {
    const [tickets, setTickets] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category: '',
        search: '',
    });
    const [loading, setLoading] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const { data } = await getTickets(filters);
            setTickets(data);
        } catch (error) {
            console.error("Error fetching tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filters, refreshTrigger]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleStatusChange = async (id, newStatus) => {
        const previousTickets = [...tickets];
        setTickets(tickets.map(t => t._id === id ? { ...t, status: newStatus } : t));

        try {
            await updateTicket(id, { status: newStatus });
            fetchTickets();
        } catch (error) {
            console.error("Error updating status", error);
            setTickets(previousTickets);
        }
    };

    const statusConfig = {
        open: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Open', dot: 'bg-emerald-500' },
        in_progress: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress', dot: 'bg-amber-500' },
        resolved: { bg: 'bg-brand-100', text: 'text-brand-700', label: 'Resolved', dot: 'bg-brand-500' },
        closed: { bg: 'bg-surface-100', text: 'text-surface-500', label: 'Closed', dot: 'bg-surface-500' },
    };

    const priorityStyles = {
        low: 'text-surface-600 bg-surface-100 border-surface-200',
        medium: 'text-brand-600 bg-brand-50 border-brand-200',
        high: 'text-orange-600 bg-orange-50 border-orange-200',
        critical: 'text-red-600 bg-red-50 border-red-200 font-bold',
    };

    return (
        <div className="space-y-6">
            {/* List Header */}
            <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-surface-200 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-surface-900">Ticket Feed</h2>
                    <p className="text-sm text-surface-500 mt-1">Manage and track support requests</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-surface-100 rounded-full text-xs font-semibold text-surface-600 border border-surface-200">
                        {tickets.length} Total
                    </span>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-2 rounded-xl border border-surface-200 shadow-sm flex flex-col md:flex-row gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-surface-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </span>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search by title or description..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="w-full pl-10 pr-4 py-2 bg-transparent text-sm text-surface-800 placeholder:text-surface-400 focus:outline-none"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-600 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer hover:bg-white transition-colors">
                        <option value="">Status: All</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                    <select name="priority" value={filters.priority} onChange={handleFilterChange} className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-600 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer hover:bg-white transition-colors">
                        <option value="">Priority: All</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                    </select>
                    <select name="category" value={filters.category} onChange={handleFilterChange} className="bg-surface-50 border border-surface-200 rounded-lg px-3 py-2 text-sm text-surface-600 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer hover:bg-white transition-colors">
                        <option value="">Category: All</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical</option>
                        <option value="account">Account</option>
                        <option value="general">General</option>
                    </select>
                </div>
            </div>

            {/* Tickets */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-xl border border-surface-100 shadow-sm animate-pulse"></div>)}
                    </div>
                ) : (
                    <>
                        {tickets.map((ticket) => (
                            <div key={ticket._id} className="group bg-white rounded-xl border border-surface-200 p-5 hover:shadow-soft hover:border-brand-200 transition-all duration-200 relative overflow-hidden">
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${ticket.status === 'open' ? 'bg-emerald-500' : ticket.status === 'in_progress' ? 'bg-amber-500' : ticket.status === 'resolved' ? 'bg-brand-500' : 'bg-surface-300'}`}></div>

                                <div className="pl-3">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig[ticket.status].bg} ${statusConfig[ticket.status].text}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[ticket.status].dot}`}></span>
                                                {statusConfig[ticket.status].label}
                                            </span>
                                            <span className="text-surface-400 text-xs font-mono hidden sm:inline-block">#{ticket._id.slice(-6)}</span>
                                        </div>
                                        <span className="text-xs text-surface-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Title & Desc */}
                                    <h3 className="font-bold text-lg text-surface-900 mb-1 group-hover:text-brand-600 transition-colors">{ticket.title}</h3>
                                    <p className="text-surface-600 text-sm leading-relaxed mb-4 max-w-2xl">{ticket.description}</p>

                                    {/* Meta & Actions */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-surface-50 mt-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`px-2.5 py-0.5 border rounded-md text-[10px] uppercase tracking-wider font-semibold ${priorityStyles[ticket.priority]}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="flex items-center gap-1 text-xs text-surface-500">
                                                <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                                                {ticket.category}
                                            </span>
                                            {ticket.contact_email && (
                                                <span className="flex items-center gap-1 text-xs text-surface-500" title={ticket.contact_email}>
                                                    <svg className="w-3.5 h-3.5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                    {ticket.contact_email.split('@')[0]}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                                                <button onClick={() => handleStatusChange(ticket._id, 'resolved')} className="p-2 text-brand-600 hover:bg-brand-50 rounded-lg transition" title="Mark Resolved">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </button>
                                            )}
                                            {ticket.status === 'open' && (
                                                <button onClick={() => handleStatusChange(ticket._id, 'in_progress')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition" title="Start Work">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </button>
                                            )}
                                            {ticket.status !== 'closed' && (
                                                <button onClick={() => handleStatusChange(ticket._id, 'closed')} className="p-2 text-surface-400 hover:bg-surface-100 hover:text-surface-600 rounded-lg transition" title="Close Ticket">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {tickets.length === 0 && (
                            <div className="text-center py-16 bg-surface-50 rounded-2xl border border-dashed border-surface-200">
                                <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                                    <svg className="w-8 h-8 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-surface-900">No tickets found</h3>
                                <p className="text-surface-500">Adjust your filters or submit a new request</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TicketList;
