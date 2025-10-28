const { validationResult } = require('express-validator');
const db = require('../config/database');

exports.createAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { request_id, driver_id, vehicle_id, scheduled_date } = req.body;

    // Check if request exists and is not already assigned
    const [requests] = await db.query(
      'SELECT * FROM service_requests WHERE id = ?',
      [request_id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    // Check if driver exists and is available
    const [drivers] = await db.query(
      "SELECT * FROM drivers WHERE id = ? AND status = 'available'",
      [driver_id]
    );

    if (drivers.length === 0) {
      return res.status(400).json({ message: 'Driver not available' });
    }

    // Check if vehicle exists and is available
    const [vehicles] = await db.query(
      "SELECT * FROM vehicles WHERE id = ? AND status = 'available'",
      [vehicle_id]
    );

    if (vehicles.length === 0) {
      return res.status(400).json({ message: 'Vehicle not available' });
    }

    // Create assignment
    const [result] = await db.query(
      `INSERT INTO assignments 
       (request_id, driver_id, vehicle_id, scheduled_date, status)
       VALUES (?, ?, ?, ?, 'scheduled')`,
      [request_id, driver_id, vehicle_id, scheduled_date]
    );

    // Update service request status
    await db.query(
      "UPDATE service_requests SET status = 'assigned' WHERE id = ?",
      [request_id]
    );

    // Update driver and vehicle status
    await db.query("UPDATE drivers SET status = 'assigned' WHERE id = ?", [driver_id]);
    await db.query("UPDATE vehicles SET status = 'in_use' WHERE id = ?", [vehicle_id]);

    res.status(201).json({
      message: 'Assignment created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Error creating assignment' });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [assignments] = await db.query(
      `SELECT 
         a.*,
         sr.customer_name,
         sr.service_type,
         sr.pickup_address,
         sr.delivery_address,
         d.name as driver_name,
         d.phone as driver_phone,
         v.model as vehicle_model,
         v.plate_number
       FROM assignments a
       LEFT JOIN service_requests sr ON a.request_id = sr.id
       LEFT JOIN drivers d ON a.driver_id = d.id
       LEFT JOIN vehicles v ON a.vehicle_id = v.id
       ORDER BY a.scheduled_date DESC
       LIMIT ? OFFSET ?`,
      [parseInt(limit), parseInt(offset)]
    );

    const [countResult] = await db.query('SELECT COUNT(*) as total FROM assignments');
    const total = countResult[0].total;

    res.json({
      data: assignments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all assignments error:', error);
    res.status(500).json({ message: 'Error fetching assignments' });
  }
};

exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [assignments] = await db.query(
      `SELECT 
         a.*,
         sr.customer_name,
         sr.service_type,
         d.name as driver_name,
         v.model as vehicle_model
       FROM assignments a
       LEFT JOIN service_requests sr ON a.request_id = sr.id
       LEFT JOIN drivers d ON a.driver_id = d.id
       LEFT JOIN vehicles v ON a.vehicle_id = v.id
       WHERE a.id = ?`,
      [id]
    );

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignments[0]);
  } catch (error) {
    console.error('Get assignment by ID error:', error);
    res.status(500).json({ message: 'Error fetching assignment' });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduled_date, status } = req.body;

    const updateFields = [];
    const params = [];

    if (scheduled_date) {
      updateFields.push('scheduled_date = ?');
      params.push(scheduled_date);
    }

    if (status) {
      const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      updateFields.push('status = ?');
      params.push(status);
      
      // If assignment is completed or cancelled, free up driver and vehicle
      if (status === 'completed' || status === 'cancelled') {
        const [assignments] = await db.query('SELECT * FROM assignments WHERE id = ?', [id]);
        if (assignments.length > 0) {
          await db.query("UPDATE drivers SET status = 'available' WHERE id = ?", [assignments[0].driver_id]);
          await db.query("UPDATE vehicles SET status = 'available' WHERE id = ?", [assignments[0].vehicle_id]);
        }
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE assignments SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({ message: 'Assignment updated successfully' });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Error updating assignment' });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    // Get assignment details first
    const [assignments] = await db.query('SELECT * FROM assignments WHERE id = ?', [id]);

    if (assignments.length === 0) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const assignment = assignments[0];

    // Delete assignment
    await db.query('DELETE FROM assignments WHERE id = ?', [id]);

    // Update driver and vehicle status back to available
    await db.query("UPDATE drivers SET status = 'available' WHERE id = ?", [assignment.driver_id]);
    await db.query("UPDATE vehicles SET status = 'available' WHERE id = ?", [assignment.vehicle_id]);

    // Update service request status back to pending
    await db.query("UPDATE service_requests SET status = 'pending' WHERE id = ?", [assignment.request_id]);

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Error deleting assignment' });
  }
};
