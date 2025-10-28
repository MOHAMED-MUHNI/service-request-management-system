const db = require('../config/database');

exports.getAllDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query('SELECT * FROM drivers ORDER BY name');
    res.json(drivers);
  } catch (error) {
    console.error('Get all drivers error:', error);
    res.status(500).json({ message: 'Error fetching drivers' });
  }
};

exports.getAvailableDrivers = async (req, res) => {
  try {
    const [drivers] = await db.query(
      "SELECT * FROM drivers WHERE status = 'available' ORDER BY name"
    );
    res.json(drivers);
  } catch (error) {
    console.error('Get available drivers error:', error);
    res.status(500).json({ message: 'Error fetching available drivers' });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const [drivers] = await db.query('SELECT * FROM drivers WHERE id = ?', [id]);

    if (drivers.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(drivers[0]);
  } catch (error) {
    console.error('Get driver by ID error:', error);
    res.status(500).json({ message: 'Error fetching driver' });
  }
};
