const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getTickets);
router.patch('/:id', ticketController.updateTicket);
router.post('/classify', ticketController.classify);
router.get('/stats', ticketController.getStats);

module.exports = router;
