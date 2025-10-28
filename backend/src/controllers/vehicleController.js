const db = require('../config/database');

exports.getAllVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.query('SELECT * FROM vehicles ORDER BY model');
    res.json(vehicles);
  } catch (error) {
    console.error('Get all vehicles error:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
};

exports.getAvailableVehicles = async (req, res) => {
  try {
    const [vehicles] = await db.query(
      "SELECT * FROM vehicles WHERE status = 'available' ORDER BY model"
    );
    res.json(vehicles);
  } catch (error) {
    console.error('Get available vehicles error:', error);
    res.status(500).json({ message: 'Error fetching available vehicles' });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const [vehicles] = await db.query('SELECT * FROM vehicles WHERE id = ?', [id]);

    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(vehicles[0]);
  } catch (error) {
    console.error('Get vehicle by ID error:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
};
