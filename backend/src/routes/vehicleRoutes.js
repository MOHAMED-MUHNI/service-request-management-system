const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All vehicle routes require authentication

router.get('/', vehicleController.getAllVehicles);
router.get('/available', vehicleController.getAvailableVehicles);
router.get('/:id', vehicleController.getVehicleById);

module.exports = router;
