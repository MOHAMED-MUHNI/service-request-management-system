# 🗄️ Database Information

## 📊 Database Overview

**Database Name:** `service_requests_db`  
**Type:** MySQL 8.0  
**Port:** 3306  
**Status:** ✅ Running in Docker container

---

## 🔑 Database Credentials

```plaintext
Host:     localhost (or mysql from within Docker network)
Port:     3306
Database: service_requests_db
Username: admin
Password: admin123
Root Password: rootpassword
```

---

## 📋 Database Tables (5 Tables)

### 1️⃣ **users** - Admin Users
```sql
Columns: id, username, password_hash, email, role, created_at, updated_at
Current Data: 1 admin user
```

**Sample Data:**
| ID | Username | Email | Role |
|----|----------|-------|------|
| 1 | admin | admin@example.com | admin |

---

### 2️⃣ **drivers** - Driver Information
```sql
Columns: id, name, phone, email, license_number, status, created_at, updated_at
Current Data: 5 drivers
Status Values: available, assigned, off_duty
```

**Sample Data:**
| ID | Name | Phone | License | Status |
|----|------|-------|---------|--------|
| 1 | John Smith | 555-0101 | DL001 | assigned |
| 2 | Sarah Johnson | 555-0102 | DL002 | available |
| 3 | Mike Wilson | 555-0103 | DL003 | available |
| 4 | Emily Brown | 555-0104 | DL004 | available |
| 5 | David Lee | 555-0105 | DL005 | off_duty |

---

### 3️⃣ **vehicles** - Vehicle Fleet
```sql
Columns: id, model, plate_number, year, capacity, status, created_at, updated_at
Current Data: 5 vehicles
Status Values: available, in_use, maintenance
```

**Sample Data:**
| ID | Model | Plate | Year | Capacity | Status |
|----|-------|-------|------|----------|--------|
| 1 | Toyota Camry 2022 | ABC-123 | 2022 | 4 passengers | in_use |
| 2 | Honda Accord 2023 | DEF-456 | 2023 | 4 passengers | available |
| 3 | Ford Transit Van 2021 | GHI-789 | 2021 | 8 passengers | available |
| 4 | Chevrolet Silverado 2022 | JKL-012 | 2022 | 1000 lbs | available |
| 5 | Nissan Altima 2023 | MNO-345 | 2023 | 4 passengers | maintenance |

---

### 4️⃣ **service_requests** - Customer Requests
```sql
Columns: id, customer_name, customer_email, customer_phone, service_type, 
         pickup_address, delivery_address, preferred_date, preferred_time,
         special_instructions, status, created_at, updated_at
Current Data: 3 sample requests
Status Values: pending, assigned, in_progress, completed, cancelled
Service Types: Package Delivery, Furniture Moving, Document Courier, Grocery Delivery, etc.
```

**Sample Data:**
| ID | Customer | Service Type | Status | Preferred Date |
|----|----------|--------------|--------|----------------|
| 1 | Alice Thompson | Package Delivery | pending | 2025-10-27 |
| 2 | Bob Martinez | Furniture Moving | pending | 2025-10-28 |
| 3 | Carol Davis | Document Courier | assigned | 2025-10-26 |

---

### 5️⃣ **assignments** - Driver/Vehicle Assignments
```sql
Columns: id, request_id, driver_id, vehicle_id, scheduled_date, status, created_at, updated_at
Current Data: 1 sample assignment
Status Values: scheduled, in_progress, completed, cancelled
Relationships: 
  - Links to service_requests (request_id)
  - Links to drivers (driver_id)
  - Links to vehicles (vehicle_id)
```

**Sample Data:**
| ID | Request ID | Driver ID | Vehicle ID | Scheduled Date | Status |
|----|------------|-----------|------------|----------------|--------|
| 1 | 3 | 1 | 1 | 2025-10-26 | scheduled |

---

## 🔗 Database Relationships

```
service_requests (1) ←→ (1) assignments
                              ↓
                         driver (N)
                              ↓
                         vehicle (N)
```

- Each **service_request** can have one **assignment**
- Each **assignment** links to one **driver** and one **vehicle**
- Drivers and vehicles can have multiple assignments over time

---

## 🛠️ How to Access the Database

### Option 1: Using Docker Exec (PowerShell)

```powershell
# Connect to MySQL CLI
docker-compose exec mysql mysql -uadmin -padmin123 service_requests_db

# Run a query directly
docker-compose exec mysql mysql -uadmin -padmin123 service_requests_db -e "SELECT * FROM drivers;"
```

### Option 2: Using MySQL Workbench / DBeaver

**Connection Settings:**
- Connection Name: Service Request System
- Hostname: localhost
- Port: 3306
- Username: admin
- Password: admin123
- Database: service_requests_db

### Option 3: Using VS Code Extensions

Install one of these extensions:
- **MySQL** by Jun Han
- **SQLTools** by Matheus Teixeira

**Connection String:**
```
mysql://admin:admin123@localhost:3306/service_requests_db
```

---

## 📊 Useful SQL Queries

### View All Pending Requests
```sql
SELECT sr.id, sr.customer_name, sr.service_type, sr.preferred_date, sr.status
FROM service_requests sr
WHERE sr.status = 'pending'
ORDER BY sr.preferred_date;
```

### View Available Drivers and Vehicles
```sql
-- Available Drivers
SELECT * FROM drivers WHERE status = 'available';

-- Available Vehicles
SELECT * FROM vehicles WHERE status = 'available';
```

### View All Assignments with Details
```sql
SELECT 
    a.id AS assignment_id,
    sr.customer_name,
    sr.service_type,
    d.name AS driver_name,
    v.model AS vehicle_model,
    a.scheduled_date,
    a.status
FROM assignments a
JOIN service_requests sr ON a.request_id = sr.id
JOIN drivers d ON a.driver_id = d.id
JOIN vehicles v ON a.vehicle_id = v.id
ORDER BY a.scheduled_date DESC;
```

### Get Dashboard Statistics
```sql
-- Total Requests
SELECT COUNT(*) AS total_requests FROM service_requests;

-- Pending Requests
SELECT COUNT(*) AS pending_requests FROM service_requests WHERE status = 'pending';

-- Available Drivers
SELECT COUNT(*) AS available_drivers FROM drivers WHERE status = 'available';

-- Available Vehicles
SELECT COUNT(*) AS available_vehicles FROM vehicles WHERE status = 'available';
```

### Get 7-Day Request Trend
```sql
SELECT 
    DATE(created_at) AS date,
    COUNT(*) AS requests
FROM service_requests
WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(created_at)
ORDER BY date;
```

---

## 🔄 Database Backup & Restore

### Backup Database
```powershell
# Export database to SQL file
docker-compose exec mysql mysqldump -uadmin -padmin123 service_requests_db > backup.sql

# Or with Docker
docker exec service_request_db mysqldump -uadmin -padmin123 service_requests_db > backup.sql
```

### Restore Database
```powershell
# Import from SQL file
docker-compose exec -T mysql mysql -uadmin -padmin123 service_requests_db < backup.sql

# Or with Docker
docker exec -i service_request_db mysql -uadmin -padmin123 service_requests_db < backup.sql
```

---

## 🗑️ Reset Database

### Re-run Migrations and Seeds
```powershell
# Restart backend container (this will re-run migrate and seed)
docker-compose restart backend

# Or manually
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed
```

### Complete Database Reset
```powershell
# Stop all services
docker-compose down

# Remove database volume
docker volume rm interntask_mysql_data

# Start again (fresh database)
docker-compose up -d
```

---

## 📈 Database Performance

### Current Status
- **Tables:** 5
- **Total Records:** ~15 (1 user + 5 drivers + 5 vehicles + 3 requests + 1 assignment)
- **Indexes:** Primary keys on all tables, foreign keys on assignments
- **Connections:** Connection pooling enabled (limit: 10)

### Indexed Columns
- All `id` columns (Primary Keys)
- `username` in users table
- `email` in drivers table
- `status` in service_requests table
- Foreign keys in assignments table

---

## 🔒 Security Notes

⚠️ **For Development Only:**
- Default credentials are used (admin/admin123)
- Root password is set to "rootpassword"
- Database port is exposed on localhost:3306

🛡️ **For Production:**
- Change all default passwords
- Use environment variables for credentials
- Don't expose MySQL port publicly
- Enable SSL/TLS for connections
- Use strong, randomly generated passwords
- Implement database firewall rules

---

## 📚 Database Schema Diagram

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ username        │
│ password_hash   │
│ email           │
│ role            │
│ created_at      │
│ updated_at      │
└─────────────────┘

┌─────────────────────┐       ┌─────────────────────┐
│  service_requests   │       │     assignments     │
│─────────────────────│       │─────────────────────│
│ id (PK)             │◄──────│ id (PK)             │
│ customer_name       │       │ request_id (FK)     │
│ customer_email      │       │ driver_id (FK)      │
│ customer_phone      │       │ vehicle_id (FK)     │
│ service_type        │       │ scheduled_date      │
│ pickup_address      │       │ status              │
│ delivery_address    │       │ created_at          │
│ preferred_date      │       │ updated_at          │
│ preferred_time      │       └──────────┬──────────┘
│ special_instructions│                  │
│ status              │                  │
│ created_at          │                  │
│ updated_at          │                  │
└─────────────────────┘                  │
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    ▼                                         ▼
         ┌─────────────────┐                      ┌─────────────────┐
         │    drivers      │                      │    vehicles     │
         │─────────────────│                      │─────────────────│
         │ id (PK)         │                      │ id (PK)         │
         │ name            │                      │ model           │
         │ phone           │                      │ plate_number    │
         │ email           │                      │ year            │
         │ license_number  │                      │ capacity        │
         │ status          │                      │ status          │
         │ created_at      │                      │ created_at      │
         │ updated_at      │                      │ updated_at      │
         └─────────────────┘                      └─────────────────┘
```

---

## 📞 Need Help?

- Check backend logs: `docker-compose logs backend`
- Check MySQL logs: `docker-compose logs mysql`
- Verify connection: `docker-compose exec mysql mysql -uadmin -padmin123 -e "SELECT 1;"`
- Test health: `curl http://localhost:5000/health`

---

**Database is ready and fully operational!** 🚀
