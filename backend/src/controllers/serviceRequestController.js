const { validationResult } = require('express-validator');
const db = require('../config/database');

exports.createRequest = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customer_name,
      customer_email,
      customer_phone,
      service_type,
      pickup_address,
      delivery_address,
      preferred_date,
      special_instructions
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO service_requests 
       (customer_name, customer_email, customer_phone, service_type, 
        pickup_address, delivery_address, preferred_date, special_instructions, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        customer_name,
        customer_email,
        customer_phone,
        service_type,
        pickup_address,
        delivery_address,
        preferred_date,
        special_instructions || null
      ]
    );

    res.status(201).json({
      message: 'Service request created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Error creating service request' });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      service_type,
      search,
      sort_by = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let query = 'SELECT * FROM service_requests WHERE 1=1';
    const params = [];

    // Filtering
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (service_type) {
      query += ' AND service_type = ?';
      params.push(service_type);
    }

    // Search
    if (search) {
      query += ' AND (customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Count total
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Sorting and pagination
    query += ` ORDER BY ${sort_by} ${order} LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [requests] = await db.query(query, params);

    res.json({
      data: requests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({ message: 'Error fetching service requests' });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [requests] = await db.query(
      'SELECT * FROM service_requests WHERE id = ?',
      [id]
    );

    if (requests.length === 0) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json(requests[0]);
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({ message: 'Error fetching service request' });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = [];
    const params = [];

    const allowedFields = [
      'customer_name',
      'customer_email',
      'customer_phone',
      'service_type',
      'pickup_address',
      'delivery_address',
      'preferred_date',
      'special_instructions',
      'status'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        params.push(req.body[field]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    params.push(id);

    const [result] = await db.query(
      `UPDATE service_requests SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json({ message: 'Service request updated successfully' });
  } catch (error) {
    console.error('Update request error:', error);
    res.status(500).json({ message: 'Error updating service request' });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      'DELETE FROM service_requests WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json({ message: 'Service request deleted successfully' });
  } catch (error) {
    console.error('Delete request error:', error);
    res.status(500).json({ message: 'Error deleting service request' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const [result] = await db.query(
      'UPDATE service_requests SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Service request not found' });
    }

    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error updating status' });
  }
};
