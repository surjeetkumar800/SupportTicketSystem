import React, { useState } from 'react';
import { createTicket, classifyTicket } from '../api';

const TicketForm = ({ onTicketCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contact_email: '',
        category: '',
        priority: '',
    });
    const [loading, setLoading] = useState(false);
    const [classifying, setClassifying] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTicket(formData);
            setFormData({ title: '', description: '', contact_email: '', category: '', priority: '' });
            if (onTicketCreated) onTicketCreated();
        } catch (error) {
            console.error("Error creating ticket", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlurDescription = async () => {
        if (!formData.description || formData.category || formData.priority) return;

        setClassifying(true);
        try {
            const { data } = await classifyTicket(formData.description);
            setFormData((prev) => ({
                ...prev,
                category: data.suggested_category,
                priority: data.suggested_priority,
            }));
        } catch (error) {
            console.error("Classification failed", error);
        } finally {
            setClassifying(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-soft border border-surface-100 overflow-hidden sticky top-8">
            <div className="px-6 py-5 bg-gradient-to-r from-brand-900 to-brand-800 border-b border-brand-700">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    New Support Request
                </h2>
                <p className="text-brand-200 text-xs mt-1">AI-Assisted Classification Enabled</p>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">

                {/* Title Input */}
                <div className="group">
                    <label className="block text-surface-600 text-xs font-bold uppercase tracking-wide mb-2 group-focus-within:text-brand-600 transition-colors">Subject</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="e.g., Unable to access billing dashboard"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400 text-sm font-medium text-surface-900"
                        required
                        maxLength={200}
                    />
                </div>

                {/* Email Input */}
                <div className="group">
                    <label className="block text-surface-600 text-xs font-bold uppercase tracking-wide mb-2 group-focus-within:text-brand-600 transition-colors">Contact Email</label>
                    <input
                        type="email"
                        name="contact_email"
                        placeholder="name@company.com"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400 text-sm font-medium text-surface-900"
                        required
                    />
                </div>

                {/* Description Input */}
                <div className="group relative">
                    <label className="block text-surface-600 text-xs font-bold uppercase tracking-wide mb-2 group-focus-within:text-brand-600 transition-colors">Description</label>
                    <textarea
                        name="description"
                        placeholder="Describe the issue in detail. We'll automatically suggest a category for you..."
                        value={formData.description}
                        onChange={handleChange}
                        onBlur={handleBlurDescription}
                        className="w-full px-4 py-3 bg-surface-50 border border-surface-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 focus:border-brand-500 outline-none transition-all placeholder:text-surface-400 text-sm font-medium text-surface-900 min-h-[140px] resize-none"
                        required
                    />
                    {classifying && (
                        <div className="absolute top-1 right-1 flex items-center gap-2 bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse border border-brand-100">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Analyzing...
                        </div>
                    )}
                </div>

                {/* Auto-Fields */}
                <div className="grid grid-cols-2 gap-4 bg-surface-50 p-4 rounded-xl border border-surface-100 border-dashed">
                    <div>
                        <label className="block text-surface-400 text-[10px] font-bold uppercase tracking-wide mb-1">Category (Auto)</label>
                        <div className="relative">
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className={`w-full bg-transparent font-semibold outline-none appearance-none ${formData.category ? 'text-brand-700' : 'text-surface-400'}`}
                                required
                            >
                                <option value="">Pending...</option>
                                <option value="billing">Billing</option>
                                <option value="technical">Technical</option>
                                <option value="account">Account</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-surface-400 text-[10px] font-bold uppercase tracking-wide mb-1">Priority (Auto)</label>
                        <div className="relative">
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={`w-full bg-transparent font-semibold outline-none appearance-none ${formData.priority ? 'text-brand-700' : 'text-surface-400'}`}
                                required
                            >
                                <option value="">Pending...</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 focus:outline-none focus:ring-4 focus:ring-brand-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Processing Ticket...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default TicketForm;
