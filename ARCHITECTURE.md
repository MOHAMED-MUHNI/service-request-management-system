# 📐 Architecture Documentation

Detailed architecture and design decisions for the Service Request Management System.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface Layer                     │
├─────────────────────────────────────────────────────────────┤
│  React SPA (Port 3000)                                      │
│  ├── Customer Portal      (Public)                          │
│  ├── Admin Dashboard      (Protected)                       │
│  └── API Client Layer     (Axios)                           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ HTTP/REST API
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                   Application Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Express.js API Server (Port 5000)                          │
│  ├── Routes Layer        (URL Routing)                      │
│  ├── Middleware Layer    (Auth, Logging, Error)             │
│  ├── Controller Layer    (Business Logic)                   │
│  └── Service Layer       (Database Operations)              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  │ MySQL Protocol
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                    Data Layer                                │
├─────────────────────────────────────────────────────────────┤
│  MySQL Database (Port 3306)                                 │
│  ├── users                                                   │
│  ├── service_requests                                        │
│  ├── drivers                                                 │
│  ├── vehicles                                                │
│  └── assignments                                             │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

### Customer Request Flow
```
1. Customer → Frontend Form
2. Form Validation (Client-side)
3. POST /api/service-requests
4. Express Route Handler
5. Validation Middleware (express-validator)
6. serviceRequestController.createRequest
7. Database INSERT
8. Response 201 Created
9. Frontend Success Message
```

### Admin Authentication Flow
```
1. Admin → Login Form
2. POST /api/auth/login
3. authController.login
4. Query users table
5. bcrypt.compare(password, hash)
6. jwt.sign({ userId, username, role })
7. Response with token
8. Frontend stores token
9. Token sent in Authorization header
10. auth middleware validates token
```

### Assignment Scheduling Flow
```
1. Admin → Schedule Modal
2. Select Driver + Vehicle + Date
3. POST /api/assignments
4. auth middleware (verify token)
5. assignmentController.createAssignment
6. Validate availability
7. BEGIN TRANSACTION
   - INSERT assignment
   - UPDATE service_request status
   - UPDATE driver status
   - UPDATE vehicle status
8. COMMIT
9. Response 201 Created
10. Frontend refreshes data
```

## MVC Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                           MODEL                               │
├──────────────────────────────────────────────────────────────┤
│  Database Schema & Connection Pool                           │
│                                                               │
│  users            service_requests      drivers               │
│  ├── id           ├── id               ├── id                │
│  ├── username     ├── customer_name    ├── name              │
│  └── ...          └── ...              └── ...               │
│                                                               │
│  vehicles         assignments                                 │
│  ├── id           ├── id                                     │
│  ├── model        ├── request_id (FK)                        │
│  └── ...          └── ...                                    │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ SQL Queries
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                        CONTROLLER                             │
├──────────────────────────────────────────────────────────────┤
│  Business Logic Layer                                         │
│                                                               │
│  authController              serviceRequestController         │
│  ├── login()                 ├── createRequest()            │
│  └── register()              ├── getAllRequests()           │
│                              ├── updateRequest()             │
│  assignmentController        └── deleteRequest()             │
│  ├── createAssignment()                                      │
│  └── getAllAssignments()     driverController                │
│                              ├── getAllDrivers()             │
│  vehicleController           └── getAvailableDrivers()       │
│  ├── getAllVehicles()                                        │
│  └── getAvailableVehicles()  analyticsController             │
│                              ├── getDashboardStats()         │
│                              └── getRequestsByDay()          │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ JSON Response
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                           VIEW                                │
├──────────────────────────────────────────────────────────────┤
│  React Components                                             │
│                                                               │
│  Pages                   Components                           │
│  ├── CustomerRequestPage ├── DashboardStats                  │
│  ├── AdminLoginPage      ├── RequestsChart                   │
│  └── DashboardPage       ├── RequestsTable                   │
│                          └── ScheduleModal                    │
└──────────────────────────────────────────────────────────────┘
```

## Database Schema & Relationships

```
┌──────────────────┐
│     users        │
├──────────────────┤
│ PK id            │
│    username  UQ  │
│    password_hash │
│    email     UQ  │
│    role          │
└──────────────────┘

┌─────────────────────────┐
│   service_requests      │
├─────────────────────────┤
│ PK id                   │
│    customer_name        │
│    customer_email       │
│    customer_phone       │
│    service_type     IDX │
│    pickup_address       │
│    delivery_address     │
│    preferred_date       │
│    special_instructions │
│    status           IDX │
│    created_at       IDX │
│    updated_at           │
└──────────┬──────────────┘
           │
           │ 1:N
           │
┌──────────▼──────────────┐
│     assignments         │
├─────────────────────────┤
│ PK id                   │
│ FK request_id       IDX │◄───┐
│ FK driver_id        IDX │◄─┐ │
│ FK vehicle_id       IDX │◄┐│ │
│    scheduled_date   IDX │││ │
│    status               │││ │
│    created_at           │││ │
│    updated_at           │││ │
└─────────────────────────┘││ │
                           ││ │
        ┌──────────────────┘│ │
        │ N:1                │ │
        │                    │ │
┌───────▼─────────┐  ┌───────▼─────────┐
│    drivers      │  │    vehicles     │
├─────────────────┤  ├─────────────────┤
│ PK id           │  │ PK id           │
│    name         │  │    model        │
│    phone        │  │    plate_no UQ  │
│    email        │  │    year         │
│    license  UQ  │  │    capacity     │
│    status   IDX │  │    status   IDX │
│    created_at   │  │    created_at   │
│    updated_at   │  │    updated_at   │
└─────────────────┘  └─────────────────┘
```

## Component Architecture (Frontend)

```
App.js (Router & Auth)
│
├── Route: "/"
│   └── CustomerRequestPage
│       ├── State Management
│       │   ├── formData
│       │   ├── errors
│       │   ├── loading
│       │   └── success
│       └── API Call: serviceRequestAPI.create()
│
├── Route: "/admin/login"
│   └── AdminLoginPage
│       ├── State Management
│       │   ├── formData
│       │   ├── error
│       │   └── loading
│       └── API Call: authAPI.login()
│
└── Route: "/admin/dashboard" (Protected)
    └── DashboardPage
        ├── State Management
        │   ├── stats
        │   ├── chartData
        │   ├── requests
        │   ├── pagination
        │   ├── filters
        │   ├── drivers
        │   ├── vehicles
        │   └── modals
        │
        ├── Components
        │   ├── DashboardStats (stats)
        │   │   └── 6 stat cards
        │   │
        │   ├── RequestsChart (chartData)
        │   │   └── Recharts LineChart
        │   │
        │   ├── RequestsTable (requests, pagination)
        │   │   ├── Search/Filter controls
        │   │   ├── Table with data
        │   │   └── Pagination controls
        │   │
        │   └── ScheduleModal (conditional)
        │       ├── Request details
        │       ├── Driver selector
        │       ├── Vehicle selector
        │       └── Date picker
        │
        └── API Calls
            ├── analyticsAPI.getDashboard()
            ├── analyticsAPI.getRequestsByDay()
            ├── serviceRequestAPI.getAll()
            ├── driverAPI.getAvailable()
            ├── vehicleAPI.getAvailable()
            └── assignmentAPI.create()
```

## Middleware Pipeline

```
HTTP Request
    │
    ├─► logger middleware
    │   └─► Log request details
    │
    ├─► helmet middleware
    │   └─► Set security headers
    │
    ├─► cors middleware
    │   └─► Handle CORS
    │
    ├─► express.json middleware
    │   └─► Parse JSON body
    │
    ├─► Route handler
    │   │
    │   ├─► auth middleware (if protected)
    │   │   ├─► Extract token
    │   │   ├─► Verify JWT
    │   │   ├─► Attach user to req
    │   │   └─► Continue or 401
    │   │
    │   ├─► express-validator middleware
    │   │   ├─► Validate inputs
    │   │   └─► Continue or 400
    │   │
    │   └─► Controller function
    │       ├─► Business logic
    │       ├─► Database operations
    │       └─► Send response
    │
    └─► errorHandler middleware
        ├─► Catch any errors
        ├─► Log error
        ├─► Format error response
        └─► Send error to client

HTTP Response
```

## API Client Architecture (Frontend)

```
┌─────────────────────────────────────┐
│         API Client (Axios)          │
├─────────────────────────────────────┤
│  Base Configuration                 │
│  ├── baseURL: /api                  │
│  └── headers: Content-Type          │
│                                      │
│  Request Interceptor                │
│  ├── Get token from localStorage    │
│  └── Add Authorization header       │
│                                      │
│  Response Interceptor               │
│  ├── Success: return response       │
│  └── Error: handle 401 (logout)     │
│                                      │
│  API Modules                         │
│  ├── authAPI                         │
│  │   ├── login(credentials)         │
│  │   └── register(userData)         │
│  │                                   │
│  ├── serviceRequestAPI               │
│  │   ├── create(data)                │
│  │   ├── getAll(params)              │
│  │   ├── getById(id)                 │
│  │   ├── update(id, data)            │
│  │   ├── delete(id)                  │
│  │   └── updateStatus(id, status)    │
│  │                                   │
│  ├── assignmentAPI                   │
│  │   ├── create(data)                │
│  │   └── getAll(params)              │
│  │                                   │
│  ├── driverAPI                       │
│  │   ├── getAll()                    │
│  │   └── getAvailable()              │
│  │                                   │
│  ├── vehicleAPI                      │
│  │   ├── getAll()                    │
│  │   └── getAvailable()              │
│  │                                   │
│  └── analyticsAPI                    │
│      ├── getDashboard()              │
│      └── getRequestsByDay(days)      │
└─────────────────────────────────────┘
```

## State Management Flow

```
User Action
    │
    ▼
Event Handler
    │
    ├─► Update UI State (loading: true)
    │
    ├─► API Call
    │   │
    │   ├─► Success
    │   │   ├─► Update data state
    │   │   ├─► Clear errors
    │   │   └─► Update UI (loading: false, success: true)
    │   │
    │   └─► Error
    │       ├─► Update error state
    │       └─► Update UI (loading: false)
    │
    └─► Component Re-render
        └─► Display new state
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│          Security Layers                │
├─────────────────────────────────────────┤
│                                          │
│  1. Network Layer                        │
│     ├── HTTPS/TLS encryption            │
│     ├── Firewall rules                  │
│     └── DDoS protection                 │
│                                          │
│  2. Application Layer                    │
│     ├── Helmet (security headers)       │
│     ├── CORS policy                     │
│     ├── Rate limiting (optional)        │
│     └── Input validation                │
│                                          │
│  3. Authentication Layer                 │
│     ├── Password hashing (bcrypt)       │
│     ├── JWT tokens                      │
│     ├── Token expiration                │
│     └── Protected routes                │
│                                          │
│  4. Authorization Layer                  │
│     ├── Role-based access               │
│     ├── Route protection                │
│     └── Resource ownership check        │
│                                          │
│  5. Data Layer                           │
│     ├── Parameterized queries           │
│     ├── SQL injection prevention        │
│     ├── Data encryption at rest         │
│     └── Regular backups                 │
└─────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘

Internet
    │
    ▼
┌─────────────────┐
│   Load Balancer │  (Optional - for scaling)
│   / CDN         │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Nginx Proxy    │  Port 80/443
│  ├─► SSL/TLS    │
│  ├─► Compression│
│  └─► Caching    │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  Frontend   │   │  Backend    │   │   MySQL DB   │
│  Container  │   │  Container  │   │   Container  │
│  (React)    │   │  (Node.js)  │   │              │
│  Port 3000  │   │  Port 5000  │   │  Port 3306   │
└─────────────┘   └─────────────┘   └──────────────┘
```

## Design Patterns Used

### 1. MVC Pattern
- **Model**: Database schema and queries
- **View**: React components
- **Controller**: Express route handlers

### 2. Repository Pattern
- Database operations abstracted in controllers
- Reusable query logic

### 3. Middleware Pattern
- Chain of responsibility for request processing
- Auth, logging, error handling

### 4. Factory Pattern
- Database connection pool
- Axios instance creation

### 5. Observer Pattern
- React state updates trigger re-renders
- Event handlers for user actions

### 6. Singleton Pattern
- Database connection pool
- API client instance

## Technology Decisions

### Why Node.js?
- JavaScript everywhere (full-stack)
- Async I/O for high concurrency
- Rich ecosystem (npm)
- Easy deployment

### Why React?
- Component-based architecture
- Virtual DOM for performance
- Large community support
- Easy state management

### Why MySQL?
- Relational data structure
- ACID compliance
- Foreign keys for referential integrity
- Mature and stable

### Why JWT?
- Stateless authentication
- Easy to scale horizontally
- Works across domains
- Industry standard

### Why Docker?
- Consistent environments
- Easy deployment
- Service isolation
- Reproducible builds

---

This architecture provides:
✅ Scalability
✅ Maintainability
✅ Security
✅ Performance
✅ Developer experience
