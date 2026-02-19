import React, { useState } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import StatsDashboard from './components/StatsDashboard';

function App() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleTicketCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-surface-50 font-sans text-surface-900">

            {/* Top Navbar */}
            <nav className="bg-white border-b border-surface-200 sticky top-0 z-50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-surface-900">Support<span className="text-brand-600">Hub</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center text-sm text-surface-500 bg-surface-100 px-3 py-1.5 rounded-full">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
                            System Operational
                        </div>
                        <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm border border-brand-200">
                            JD
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <StatsDashboard refreshTrigger={refreshTrigger} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Feed */}
                    <div className="lg:col-span-8 order-2 lg:order-1">
                        <TicketList refreshTrigger={refreshTrigger} />
                    </div>

                    {/* Sidebar Form */}
                    <div className="lg:col-span-4 order-1 lg:order-2">
                        <TicketForm onTicketCreated={handleTicketCreated} />
                    </div>
                </div>

            </main>
        </div>
    );
}

export default App;
