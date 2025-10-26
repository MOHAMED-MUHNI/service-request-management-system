const express = require('express');
const { body } = require('express-validator');
const assignmentController = require('../controllers/assignmentController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All assignment routes require authentication

router.post(
  '/',
  [
    body('request_id').isInt().withMessage('Valid request ID is required'),
    body('driver_id').isInt().withMessage('Valid driver ID is required'),
    body('vehicle_id').isInt().withMessage('Valid vehicle ID is required'),
    body('scheduled_date').isISO8601().withMessage('Valid scheduled date is required')
  ],
  assignmentController.createAssignment
);

router.get('/', assignmentController.getAllAssignments);
router.get('/:id', assignmentController.getAssignmentById);
router.put('/:id', assignmentController.updateAssignment);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;
