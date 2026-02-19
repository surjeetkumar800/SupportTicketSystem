import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTickets = (params) => api.get('/tickets', { params });
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicket = (id, data) => api.patch(`/tickets/${id}`, data);
export const getStats = () => api.get('/tickets/stats');
export const classifyTicket = (description) => api.post('/tickets/classify', { description });

export default api;
