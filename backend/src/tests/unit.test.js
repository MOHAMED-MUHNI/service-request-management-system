const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

describe('Utility Functions', () => {
  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should verify password correctly', async () => {
      const password = 'testpassword';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongpassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Token', () => {
    const secret = 'test_secret';

    it('should generate valid token', () => {
      const payload = { userId: 1, username: 'test' };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
    });

    it('should verify valid token', () => {
      const payload = { userId: 1, username: 'test' };
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

      const decoded = jwt.verify(token, secret);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.username).toBe(payload.username);
    });

    it('should reject invalid token', () => {
      expect(() => {
        jwt.verify('invalid_token', secret);
      }).toThrow();
    });
  });
});
