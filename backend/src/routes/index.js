const express = require('express');
const authRoutes = require('./authRoutes');
const serviceRequestRoutes = require('./serviceRequestRoutes');
const assignmentRoutes = require('./assignmentRoutes');
const driverRoutes = require('./driverRoutes');
const vehicleRoutes = require('./vehicleRoutes');
const analyticsRoutes = require('./analyticsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/service-requests', serviceRequestRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/drivers', driverRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
