import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterEach, afterAll } from '@jest/globals';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

// Clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Global test utilities
global.testUtils = {
  createTestUser: async (userData: any = {}) => {
    const User = mongoose.model('User');
    const defaultUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPass123',
      role: 'member',
      status: 'active',
      ...userData,
    };
    
    const user = new User(defaultUser);
    return await user.save();
  },
  
  createTestTask: async (taskData: any = {}, userId?: string) => {
    const Task = mongoose.model('Task');
    const defaultTask = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
      assignee: userId || new mongoose.Types.ObjectId(),
      createdBy: userId || new mongoose.Types.ObjectId(),
      ...taskData,
    };
    
    const task = new Task(defaultTask);
    return await task.save();
  },
  
  generateAuthToken: (userId: string, role: string = 'member') => {
    const jwt = require('jsonwebtoken');
    return jwt.sign(
      { id: userId, role, type: 'auth' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  },
};
