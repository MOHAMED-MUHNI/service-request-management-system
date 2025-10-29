# Service Request App - Quiz Answers

## Question 1: What is the MVC architecture and how is it implemented in your project?

**Answer:**

MVC (Model-View-Controller) is a software design pattern that separates an application into three interconnected components:

### Implementation in this project:

**Model (Data Layer):**
- Located in `backend/src/config/database.js`
- Uses MySQL database with tables: users, service_requests, drivers, vehicles, assignments
- Database operations are abstracted through the connection pool
- Schemas defined in migration scripts

**View (Presentation Layer):**
- React frontend in `frontend/src/`
- Components: DashboardStats, RequestsChart, RequestsTable, ScheduleModal
- Pages: CustomerRequestPage, AdminLoginPage, DashboardPage
- Handles all UI rendering and user interactions

**Controller (Business Logic Layer):**
- Located in `backend/src/controllers/`
- Controllers: authController, serviceRequestController, assignmentController, driverController, vehicleController, analyticsController
- Handles HTTP requests, validation, business logic, and responses
- Communicates between Model and View through REST APIs

**Flow Example:**
```
User Action (View) → API Request → Route → Controller → Database (Model) → Response → View Update
```

## Question 2: Explain the database schema and relationships

**Answer:**

### Database Schema:

**users**
- Primary table for authentication
- Fields: id, username, password_hash, email, role
- Indexed on: username, email (unique)

**service_requests**
- Core table storing customer service requests
- Fields: id, customer details, service info, status, dates
- Indexed on: status, service_type, created_at
- Status enum: pending → assigned → in_progress → completed/cancelled

**drivers**
- Stores driver information
- Fields: id, name, phone, email, license_number, status
- Indexed on: status, license_number (unique)
- Status enum: available, assigned, off_duty

**vehicles**
- Stores vehicle information
- Fields: id, model, plate_number, year, capacity, status
- Indexed on: status, plate_number (unique)
- Status enum: available, in_use, maintenance

**assignments**
- Junction table connecting requests, drivers, and vehicles
- Fields: id, request_id, driver_id, vehicle_id, scheduled_date, status
- Foreign Keys: request_id → service_requests, driver_id → drivers, vehicle_id → vehicles
- Cascade deletes to maintain referential integrity

### Relationships:

**One-to-Many:**
- One service_request can have multiple assignments (if reassigned)
- One driver can have multiple assignments over time
- One vehicle can have multiple assignments over time

**Many-to-One:**
- Multiple assignments reference one service_request
- Multiple assignments reference one driver
- Multiple assignments reference one vehicle

**ERD:**
```
service_requests ──┐
                   ├──> assignments
drivers ───────────┤
                   │
vehicles ──────────┘
```

## Question 3: How is authentication and authorization implemented?

**Answer:**

### Authentication (JWT-based):

**1. Registration/Login:**
- User credentials stored in `users` table
- Passwords hashed using bcryptjs (salt rounds: 10)
- On login, credentials validated against database
- JWT token generated with payload: { userId, username, role }
- Token signed with JWT_SECRET and expires in 24h

**2. Token Structure:**
```javascript
jwt.sign(
  { userId, username, role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
)
```

**3. Token Storage:**
- Frontend stores token in localStorage
- Sent with requests via Authorization header: `Bearer <token>`

### Authorization (Middleware-based):

**1. Auth Middleware (`backend/src/middleware/auth.js`):**
```javascript
- Extracts token from Authorization header
- Verifies token using JWT_SECRET
- Decodes user information
- Attaches user to req.user
- Returns 401 if invalid/expired
```

**2. Protected Routes:**
- All admin routes require authentication
- Public routes: POST /service-requests, POST /auth/login
- Protected routes: GET/PUT/DELETE /service-requests, all assignments, drivers, vehicles

**3. Frontend Protection:**
```javascript
- PrivateRoute component checks localStorage for token
- Redirects to login if no token
- API interceptors add token to requests
- Automatic logout on 401 responses
```

**Security Features:**
- Password hashing (bcrypt)
- JWT token expiration
- HTTP-only approach (could use cookies)
- CORS protection
- Helmet middleware for security headers
- Input validation on all endpoints

## Question 4: Explain the API endpoints and their purposes

**Answer:**

### Authentication Endpoints:

**POST /api/auth/login**
- Purpose: User login
- Access: Public
- Returns: JWT token and user info

**POST /api/auth/register**
- Purpose: User registration
- Access: Public
- Returns: JWT token and new user info

### Service Request Endpoints:

**POST /api/service-requests**
- Purpose: Create new service request
- Access: Public (customer-facing)
- Validation: All required fields, email format, date validation

**GET /api/service-requests**
- Purpose: List all requests with pagination, filtering, search
- Access: Protected (admin only)
- Query params: page, limit, status, service_type, search

**GET /api/service-requests/:id**
- Purpose: Get single request details
- Access: Protected

**PUT /api/service-requests/:id**
- Purpose: Update request details
- Access: Protected

**PATCH /api/service-requests/:id/status**
- Purpose: Update request status only
- Access: Protected

**DELETE /api/service-requests/:id**
- Purpose: Delete request
- Access: Protected

### Assignment Endpoints:

**POST /api/assignments**
- Purpose: Assign driver and vehicle to request
- Access: Protected
- Validation: Check availability, update statuses

**GET /api/assignments**
- Purpose: List all assignments with details
- Access: Protected
- Includes: Request, driver, and vehicle info (JOIN)

### Driver/Vehicle Endpoints:

**GET /api/drivers**
- Purpose: List all drivers
- Access: Protected

**GET /api/drivers/available**
- Purpose: List only available drivers
- Access: Protected

**GET /api/vehicles**
- Purpose: List all vehicles
- Access: Protected

**GET /api/vehicles/available**
- Purpose: List only available vehicles
- Access: Protected

### Analytics Endpoints:

**GET /api/analytics/dashboard**
- Purpose: Get summary statistics
- Access: Protected
- Returns: Total requests, pending, completed, active assignments, available resources

**GET /api/analytics/requests-by-day**
- Purpose: Get time-series data for chart
- Access: Protected
- Query params: days (default 7)
- Returns: Date and count array

## Question 5: How is error handling implemented?

**Answer:**

### Backend Error Handling:

**1. Error Handler Middleware (`backend/src/middleware/errorHandler.js`):**
- Centralized error handling
- Catches all errors from routes and controllers
- Returns consistent error responses
- Handles specific error types:
  - Validation errors (400)
  - JWT errors (401)
  - Database errors (409 for duplicates)
  - Generic errors (500)

**2. Try-Catch Blocks:**
- All async operations wrapped in try-catch
- Errors logged to console and Winston logger
- User-friendly messages returned

**3. Validation:**
- express-validator for input validation
- Field-level validation rules
- Custom error messages
- Returns 400 with error array

**Example:**
```javascript
try {
  await someOperation();
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ message: 'User-friendly message' });
}
```

### Frontend Error Handling:

**1. API Interceptors:**
```javascript
- Response interceptor catches errors
- 401 errors trigger automatic logout
- User redirected to login
- Error messages displayed to user
```

**2. Component-Level:**
- State for error messages
- Display errors in UI
- Clear errors on retry
- Loading states during operations

**3. Form Validation:**
- Client-side validation before submission
- Real-time error display
- Clear errors on input change
- Prevent submission with errors

### Logging:

**Winston Logger:**
- Request/response logging
- Error logging to file
- Separate files for errors and combined logs
- Console output in development

## Question 6: What testing strategies are implemented?

**Answer:**

### Testing Framework:
- **Jest** - Testing framework
- **Supertest** - API endpoint testing
- **Coverage** - Code coverage reports

### Test Types:

**1. Unit Tests (`backend/src/tests/unit.test.js`):**
- Test utility functions in isolation
- Password hashing tests (bcrypt)
- JWT token generation and verification
- Mock-free tests for crypto operations

**2. API Integration Tests (`backend/src/tests/api.test.js`):**
- End-to-end API testing
- Test complete request/response cycle
- Authentication flow testing
- CRUD operations testing
- Validation testing

### Test Coverage:

**Authentication Tests:**
- Login with valid credentials
- Login with invalid credentials
- Token generation
- Token verification

**Service Request Tests:**
- Create request with valid data
- Create request with missing fields
- Get all requests (requires auth)
- Pagination and filtering

**Validation Tests:**
- Required field validation
- Email format validation
- Date format validation
- Input sanitization

### Running Tests:
```bash
npm test              # Run all tests
npm test -- --coverage  # With coverage report
npm test -- --watch   # Watch mode
```

### Future Testing Improvements:
- Database transaction rollback after tests
- Mock database for faster tests
- Frontend component tests with React Testing Library
- E2E tests with Cypress/Playwright
- Performance testing
- Load testing

## Question 7: How is the application containerized with Docker?

**Answer:**

### Docker Setup:

**1. Backend Dockerfile (`backend/Dockerfile`):**
```dockerfile
- Base: node:18-alpine (lightweight)
- Working directory: /app
- Copy package files and install dependencies
- Copy source code
- Create logs directory
- Expose port 5000
- Start with npm start
```

**2. Frontend Dockerfile (`frontend/Dockerfile`):**
```dockerfile
- Multi-stage build for optimization
- Stage 1: Build React app
  - Install dependencies
  - Run production build
- Stage 2: Serve with Nginx
  - Copy build files
  - Copy nginx config
  - Expose port 80
```

**3. Docker Compose (`docker-compose.yml`):**

**Services:**

**mysql:**
- Image: mysql:8.0
- Environment variables for database setup
- Volume for data persistence
- Health check for startup coordination
- Port: 3306

**backend:**
- Build from backend/Dockerfile
- Depends on mysql (waits for health check)
- Environment variables for configuration
- Runs migrations and seeds on startup
- Port: 5000
- Volume mount for development

**frontend:**
- Build from frontend/Dockerfile
- Depends on backend
- Serves React app via Nginx
- Port: 3000

**nginx:**
- Reverse proxy for both services
- Routes /api to backend
- Routes / to frontend
- Port: 80

**Networks:**
- All services on same bridge network
- Services communicate by name

**Volumes:**
- mysql_data for database persistence

### Running Docker:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up --build
```

### Benefits:
- Consistent environment across machines
- Easy setup and deployment
- Service isolation
- Automated startup sequence
- Data persistence
- Development and production parity

## Question 8: Explain the frontend architecture and state management

**Answer:**

### Frontend Architecture:

**1. Component Structure:**
```
src/
├── components/        # Reusable UI components
│   ├── DashboardStats.js
│   ├── RequestsChart.js
│   ├── RequestsTable.js
│   └── ScheduleModal.js
├── pages/            # Route-level components
│   ├── CustomerRequestPage.js
│   ├── AdminLoginPage.js
│   └── DashboardPage.js
├── services/         # API layer
│   └── api.js
├── App.js           # Router and auth logic
└── index.js         # Entry point
```

**2. Routing:**
- React Router v6 for navigation
- Public route: / (customer form)
- Protected routes: /admin/login, /admin/dashboard
- PrivateRoute wrapper for auth check

**3. State Management:**
- **Local State (useState):** Form inputs, loading, errors
- **Effect Hooks (useEffect):** Data fetching, side effects
- **No Redux:** Application simple enough for component state
- **Props:** Parent-child data flow

**State Patterns:**

**Dashboard State:**
```javascript
- stats: Dashboard statistics
- chartData: 7-day chart data
- requests: Service requests list
- pagination: Page info
- filters: Search/filter criteria
- drivers/vehicles: Available resources
```

**Form State:**
```javascript
- formData: Form field values
- errors: Validation errors
- loading: Submission state
- success: Success message
```

### API Layer (`services/api.js`):

**Axios Configuration:**
- Base URL from environment
- Request interceptor adds auth token
- Response interceptor handles errors
- Automatic token refresh (logout on 401)

**API Modules:**
- authAPI: Login, register
- serviceRequestAPI: CRUD operations
- assignmentAPI: Assignment management
- driverAPI: Driver queries
- vehicleAPI: Vehicle queries
- analyticsAPI: Statistics

### UI/UX Features:

**Responsive Design:**
- Mobile-first CSS
- Flexbox and Grid layouts
- Media queries for tablets/mobile
- Touch-friendly buttons

**User Feedback:**
- Loading states during operations
- Success/error messages
- Form validation feedback
- Disabled buttons during submission

**Data Visualization:**
- Recharts for line chart
- Responsive chart sizing
- Custom styling for dashboard

### Performance Optimizations:

- Lazy loading could be added for routes
- Pagination reduces data transfer
- Debouncing on search input (could add)
- Optimized re-renders with proper key props
- Production build minification

This covers all major aspects of the application architecture, implementation, and features! 🚀
