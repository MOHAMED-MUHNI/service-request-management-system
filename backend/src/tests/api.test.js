const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  let authToken;

  // Test authentication
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      authToken = res.body.token;
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  // Test service requests
  describe('GET /api/service-requests', () => {
    it('should require authentication', async () => {
      const res = await request(app).get('/api/service-requests');
      expect(res.statusCode).toBe(401);
    });

    it('should return service requests with valid token', async () => {
      const res = await request(app)
        .get('/api/service-requests')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('pagination');
    });
  });

  describe('POST /api/service-requests', () => {
    it('should create a new service request', async () => {
      const res = await request(app)
        .post('/api/service-requests')
        .send({
          customer_name: 'Test Customer',
          customer_email: 'test@example.com',
          customer_phone: '555-9999',
          service_type: 'Test Service',
          pickup_address: 'Test Pickup',
          delivery_address: 'Test Delivery',
          preferred_date: new Date().toISOString().split('T')[0]
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/service-requests')
        .send({
          customer_name: 'Test Customer'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('errors');
    });
  });

  // Test health check
  describe('GET /health', () => {
    it('should return OK status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });
});
