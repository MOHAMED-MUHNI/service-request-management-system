const express = require('express');
const driverController = require('../controllers/driverController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All driver routes require authentication

router.get('/', driverController.getAllDrivers);
router.get('/available', driverController.getAvailableDrivers);
router.get('/:id', driverController.getDriverById);

module.exports = router;
