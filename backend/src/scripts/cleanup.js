require('dotenv').config();
const db = require('../config/database');

async function cleanup() {
  try {
    console.log('🧹 Cleaning up database...');

    // Delete all assignments
    await db.query('DELETE FROM assignments');
    console.log('✅ Deleted all assignments');

    // Keep only first 10 service requests
    await db.query('DELETE FROM service_requests WHERE id > 10');
    console.log('✅ Kept only first 10 service requests');

    // Reset AUTO_INCREMENT to prevent ID gaps
    const [rows] = await db.query('SELECT MAX(id) as max_id FROM service_requests');
    const nextId = (rows[0].max_id || 0) + 1;
    await db.query(`ALTER TABLE service_requests AUTO_INCREMENT = ${nextId}`);
    console.log(`✅ Reset AUTO_INCREMENT to ${nextId}`);

    // Reset all drivers to available
    await db.query('UPDATE drivers SET status = "available"');
    console.log('✅ Reset all drivers to available');

    // Reset all vehicles to available
    await db.query('UPDATE vehicles SET status = "available"');
    console.log('✅ Reset all vehicles to available');

    console.log('\n🎉 Database cleanup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  }
}

cleanup();
