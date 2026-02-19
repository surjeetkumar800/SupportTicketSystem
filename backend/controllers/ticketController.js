const Ticket = require('../models/Ticket');
const { classifyTicket } = require('../services/llmService');

/**
 * @desc    Create a new ticket
 * @route   POST /api/tickets
 * @access  Public
 */
exports.createTicket = async (req, res) => {
    try {
        const ticket = new Ticket(req.body);
        await ticket.save();
        res.status(201).json(ticket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

/**
 * @desc    Get all tickets with filtering and search
 * @route   GET /api/tickets
 * @query   category, priority, status, search
 * @access  Public
 */
exports.getTickets = async (req, res) => {
    try {
        const { category, priority, status, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (priority) query.priority = priority;
        if (status) query.status = status;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const tickets = await Ticket.find(query).sort({ created_at: -1 });
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
        res.json(ticket);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.classify = async (req, res) => {
    try {
        const { description } = req.body;
        if (!description) {
            return res.status(400).json({ message: 'Description is required' });
        }
        const classification = await classifyTicket(description);
        res.json(classification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getStats = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'open' });

        // Calculate stats using aggregation
        const priorityBreakdown = await Ticket.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        const categoryBreakdown = await Ticket.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        // Format breakdowns into objects { "low": 10, ... }
        const priorityObj = priorityBreakdown.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        const categoryObj = categoryBreakdown.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
        }, {});

        // Avg tickets per day
        // Group by date created_at
        const dailyStats = await Ticket.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    avgDaily: { $avg: "$count" }
                }
            }
        ]);

        const avgTicketsPerDay = dailyStats.length > 0 ? dailyStats[0].avgDaily : 0;

        res.json({
            total_tickets: totalTickets,
            open_tickets: openTickets,
            avg_tickets_per_day: parseFloat(avgTicketsPerDay.toFixed(1)),
            priority_breakdown: priorityObj,
            category_breakdown: categoryObj,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
