const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All analytics routes require authentication

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/requests-by-day', analyticsController.getRequestsByDay);

module.exports = router;
