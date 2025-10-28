const db = require('../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    // Total requests
    const [totalRequests] = await db.query('SELECT COUNT(*) as total FROM service_requests');

    // Pending requests
    const [pendingRequests] = await db.query(
      "SELECT COUNT(*) as total FROM service_requests WHERE status = 'pending'"
    );

    // Completed requests
    const [completedRequests] = await db.query(
      "SELECT COUNT(*) as total FROM service_requests WHERE status = 'completed'"
    );

    // Active assignments
    const [activeAssignments] = await db.query(
      "SELECT COUNT(*) as total FROM assignments WHERE status IN ('scheduled', 'in_progress')"
    );

    // Available drivers
    const [availableDrivers] = await db.query(
      "SELECT COUNT(*) as total FROM drivers WHERE status = 'available'"
    );

    // Available vehicles
    const [availableVehicles] = await db.query(
      "SELECT COUNT(*) as total FROM vehicles WHERE status = 'available'"
    );

    res.json({
      totalRequests: totalRequests[0].total,
      pendingRequests: pendingRequests[0].total,
      completedRequests: completedRequests[0].total,
      activeAssignments: activeAssignments[0].total,
      availableDrivers: availableDrivers[0].total,
      availableVehicles: availableVehicles[0].total
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};

exports.getRequestsByDay = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const [results] = await db.query(
      `SELECT 
         DATE(created_at) as date,
         COUNT(*) as count
       FROM service_requests
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [parseInt(days)]
    );

    res.json(results);
  } catch (error) {
    console.error('Get requests by day error:', error);
    res.status(500).json({ message: 'Error fetching requests by day' });
  }
};
