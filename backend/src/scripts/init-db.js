require('dotenv').config();
const db = require('../config/database');

async function initDatabase() {
  try {
    console.log('🔍 Checking if database needs initialization...');

    // Check if data already exists
    const [requests] = await db.query('SELECT COUNT(*) as count FROM service_requests');
    const [drivers] = await db.query('SELECT COUNT(*) as count FROM drivers');
    const [vehicles] = await db.query('SELECT COUNT(*) as count FROM vehicles');

    if (requests[0].count > 0 || drivers[0].count > 0 || vehicles[0].count > 0) {
      console.log('✅ Database already contains data. Skipping seed.');
      console.log(`   - Service Requests: ${requests[0].count}`);
      console.log(`   - Drivers: ${drivers[0].count}`);
      console.log(`   - Vehicles: ${vehicles[0].count}`);
      process.exit(0);
    }

    console.log('📦 Database is empty. Running seed script...');
    
    // Import and run seed
    require('./seed');
    
  } catch (error) {
    console.error('❌ Database initialization check failed:', error);
    console.log('🔄 Attempting to run seed anyway...');
    require('./seed');
  }
}

initDatabase();
