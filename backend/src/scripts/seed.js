require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);

    await db.query(
      `INSERT INTO users (username, password_hash, email, role) 
       VALUES ('admin', ?, 'admin@example.com', 'admin')
       ON DUPLICATE KEY UPDATE username=username`,
      [passwordHash]
    );
    console.log('✅ Admin user created (username: admin, password: admin123)');

    // Create drivers
    const drivers = [
      { name: 'John Smith', phone: '555-0101', email: 'john@example.com', license_number: 'DL001', status: 'available' },
      { name: 'Sarah Johnson', phone: '555-0102', email: 'sarah@example.com', license_number: 'DL002', status: 'available' },
      { name: 'Mike Wilson', phone: '555-0103', email: 'mike@example.com', license_number: 'DL003', status: 'available' },
      { name: 'Emily Brown', phone: '555-0104', email: 'emily@example.com', license_number: 'DL004', status: 'available' },
      { name: 'David Lee', phone: '555-0105', email: 'david@example.com', license_number: 'DL005', status: 'off_duty' }
    ];

    for (const driver of drivers) {
      await db.query(
        `INSERT INTO drivers (name, phone, email, license_number, status) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=name`,
        [driver.name, driver.phone, driver.email, driver.license_number, driver.status]
      );
    }
    console.log(`✅ ${drivers.length} drivers created`);

    // Create vehicles
    const vehicles = [
      { model: 'Toyota Camry 2022', plate_number: 'ABC-123', year: 2022, capacity: '4 passengers', status: 'available' },
      { model: 'Honda Accord 2023', plate_number: 'DEF-456', year: 2023, capacity: '4 passengers', status: 'available' },
      { model: 'Ford Transit Van 2021', plate_number: 'GHI-789', year: 2021, capacity: '8 passengers', status: 'available' },
      { model: 'Chevrolet Silverado 2022', plate_number: 'JKL-012', year: 2022, capacity: '1000 lbs', status: 'available' },
      { model: 'Nissan Altima 2023', plate_number: 'MNO-345', year: 2023, capacity: '4 passengers', status: 'maintenance' }
    ];

    for (const vehicle of vehicles) {
      await db.query(
        `INSERT INTO vehicles (model, plate_number, year, capacity, status) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE model=model`,
        [vehicle.model, vehicle.plate_number, vehicle.year, vehicle.capacity, vehicle.status]
      );
    }
    console.log(`✅ ${vehicles.length} vehicles created`);

    // Create sample service requests
    const requests = [
      {
        customer_name: 'Alice Thompson',
        customer_email: 'alice@example.com',
        customer_phone: '555-1001',
        service_type: 'Package Delivery',
        pickup_address: '123 Main St, City A',
        delivery_address: '456 Oak Ave, City B',
        preferred_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        special_instructions: 'Handle with care - fragile items',
        status: 'pending'
      },
      {
        customer_name: 'Bob Martinez',
        customer_email: 'bob@example.com',
        customer_phone: '555-1002',
        service_type: 'Furniture Moving',
        pickup_address: '789 Elm St, City C',
        delivery_address: '321 Pine Rd, City D',
        preferred_date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // 2 days
        special_instructions: 'Large sofa - need help lifting',
        status: 'pending'
      },
      {
        customer_name: 'Carol Davis',
        customer_email: 'carol@example.com',
        customer_phone: '555-1003',
        service_type: 'Document Courier',
        pickup_address: '555 Business Blvd, City E',
        delivery_address: '777 Corporate Dr, City F',
        preferred_date: new Date().toISOString().split('T')[0], // Today
        special_instructions: 'Urgent delivery required',
        status: 'assigned'
      }
    ];

    for (const request of requests) {
      await db.query(
        `INSERT INTO service_requests 
         (customer_name, customer_email, customer_phone, service_type, 
          pickup_address, delivery_address, preferred_date, special_instructions, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          request.customer_name,
          request.customer_email,
          request.customer_phone,
          request.service_type,
          request.pickup_address,
          request.delivery_address,
          request.preferred_date,
          request.special_instructions,
          request.status
        ]
      );
    }
    console.log(`✅ ${requests.length} sample service requests created`);

    // Create sample assignment
    await db.query(
      `INSERT INTO assignments (request_id, driver_id, vehicle_id, scheduled_date, status) 
       VALUES (3, 1, 1, ?, 'scheduled')`,
      [new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );

    // Update driver and vehicle status
    await db.query('UPDATE drivers SET status = "assigned" WHERE id = 1');
    await db.query('UPDATE vehicles SET status = "in_use" WHERE id = 1');

    console.log('✅ Sample assignment created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
