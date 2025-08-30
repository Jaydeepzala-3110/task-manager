import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import User from '../models/user.model';
import { hashPassword } from '../utils/auth.util';

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('userData');
      expect(response.body.data.userData.email).toBe(userData.email);
      expect(response.body.data.userData.username).toBe(userData.username);
      expect(response.body.data.userData.role).toBe('member');
    });

    it('should register a user with admin role when specified', async () => {
      const userData = {
        username: 'adminuser',
        email: 'admin@example.com',
        password: 'AdminPass123',
        role: 'admin',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.data.userData.role).toBe('admin');
    });

    it('should fail with invalid email format', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with weak password', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when user already exists', async () => {
      // Create a user first
      const existingUser = await global.testUtils.createTestUser({
        email: 'existing@example.com',
      });

      const userData = {
        username: 'newuser',
        email: 'existing@example.com', // Same email
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('existing account');
    });

    it('should fail with missing required fields', async () => {
      const userData = {
        username: 'testuser',
        // Missing email and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user for login tests
      const hashedPassword = await hashPassword('TestPass123');
      await User.create({
        username: 'logintest',
        email: 'login@example.com',
        password: hashedPassword,
        role: 'member',
        status: 'active',
      });
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('userData');
      expect(response.body.data.userData.email).toBe(loginData.email);
    });

    it('should fail with incorrect password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should fail with missing credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        // Missing password
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid email format', async () => {
      const loginData = {
        email: 'invalid-email',
        password: 'TestPass123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should handle logout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Password Validation', () => {
    it('should accept valid password patterns', async () => {
      const validPasswords = [
        'TestPass123',
        'MySecure1Password',
        'Complex@Password123',
      ];

      for (const password of validPasswords) {
        const userData = {
          username: `user_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password,
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(201);

        expect(response.body.success).toBe(true);
      }
    });

    it('should reject invalid password patterns', async () => {
      const invalidPasswords = [
        'weak', // Too short
        'nouppercase123', // No uppercase
        'NOLOWERCASE123', // No lowercase
        'NoNumbers', // No numbers
        '12345678', // Only numbers
      ];

      for (const password of invalidPasswords) {
        const userData = {
          username: `user_${Date.now()}`,
          email: `test_${Date.now()}@example.com`,
          password,
        };

        const response = await request(app)
          .post('/api/auth/register')
          .send(userData)
          .expect(400);

        expect(response.body.success).toBe(false);
      }
    });
  });
});
