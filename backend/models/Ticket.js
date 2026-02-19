const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200,
    },
    description: {
        type: String,
        required: true,
    },
    contact_email: {
        type: String,
        required: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    category: {
        type: String,
        enum: ['billing', 'technical', 'account', 'general'],
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        required: true,
    },
    status: {
        type: String,
        enum: ['open', 'in_progress', 'resolved', 'closed'],
        default: 'open',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Ticket', TicketSchema);
