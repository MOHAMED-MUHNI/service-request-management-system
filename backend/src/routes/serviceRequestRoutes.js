const express = require('express');
const { body } = require('express-validator');
const serviceRequestController = require('../controllers/serviceRequestController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public route - create service request
router.post(
  '/',
  [
    body('customer_name').notEmpty().withMessage('Customer name is required'),
    body('customer_email').isEmail().withMessage('Valid email is required'),
    body('customer_phone').notEmpty().withMessage('Phone number is required'),
    body('service_type').notEmpty().withMessage('Service type is required'),
    body('pickup_address').notEmpty().withMessage('Pickup address is required'),
    body('delivery_address').notEmpty().withMessage('Delivery address is required'),
    body('preferred_date').isISO8601().withMessage('Valid date is required')
  ],
  serviceRequestController.createRequest
);

// Protected routes - require authentication
router.get('/', auth, serviceRequestController.getAllRequests);
router.get('/:id', auth, serviceRequestController.getRequestById);
router.put('/:id', auth, serviceRequestController.updateRequest);
router.delete('/:id', auth, serviceRequestController.deleteRequest);
router.patch('/:id/status', auth, serviceRequestController.updateStatus);

module.exports = router;
