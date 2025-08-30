import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { TaskModel } from '../models/task.model';

describe('Task Endpoints', () => {
  let authToken: string;
  let userId: string;
  let adminToken: string;
  let adminId: string;

  beforeEach(async () => {
    const user = await global.testUtils.createTestUser({
      email: 'member@example.com',
      role: 'member',
    });
    userId = user._id.toString();
    authToken = global.testUtils.generateAuthToken(userId, 'member');

    const admin = await global.testUtils.createTestUser({
      email: 'admin@example.com',
      role: 'admin',
    });
    adminId = admin._id.toString();
    adminToken = global.testUtils.generateAuthToken(adminId, 'admin');
  });

  describe('GET /api/task/list', () => {
    beforeEach(async () => {
      await global.testUtils.createTestTask({
        title: 'Task 1',
        status: 'todo',
        priority: 'high',
        assignee: userId,
        createdBy: userId,
      });
      await global.testUtils.createTestTask({
        title: 'Task 2',
        status: 'in-progress',
        priority: 'medium',
        assignee: userId,
        createdBy: userId,
      });
      await global.testUtils.createTestTask({
        title: 'Task 3',
        status: 'done',
        priority: 'low',
        assignee: userId,
        createdBy: userId,
      });
    });

    it('should list tasks with pagination', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ page: 1, limit: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('page', 1);
      expect(response.body.data.pagination).toHaveProperty('limit', 2);
      expect(response.body.data.pagination).toHaveProperty('total');
      expect(response.body.data.pagination).toHaveProperty('totalPages');
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ status: 'todo' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('todo');
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ priority: 'high' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].priority).toBe('high');
    });

    it('should search tasks by title', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ search: 'Task 1' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].title).toBe('Task 1');
    });

    it('should sort tasks by creation date', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .set('Authorization', `Bearer ${authToken}`)
        .query({ sortBy: 'createdAt', sortOrder: 'desc' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(3);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/task/list')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/task/create', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString(),
        tags: ['frontend', 'bug'],
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.description).toBe(taskData.description);
      expect(response.body.data.assignee).toBe(userId);
      expect(response.body.data.createdBy).toBe(userId);
    });

    it('should create task with minimal data', async () => {
      const taskData = {
        title: 'Minimal Task',
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.status).toBe('todo'); // Default status
      expect(response.body.data.priority).toBe('low'); // Default priority
    });

    it('should fail with missing title', async () => {
      const taskData = {
        description: 'Task description',
        status: 'todo',
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid status', async () => {
      const taskData = {
        title: 'Invalid Task',
        status: 'invalid-status',
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with invalid priority', async () => {
      const taskData = {
        title: 'Invalid Task',
        priority: 'invalid-priority',
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const taskData = {
        title: 'Unauthorized Task',
      };

      const response = await request(app)
        .post('/api/task/create')
        .send(taskData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/task/update/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await global.testUtils.createTestTask({
        title: 'Original Task',
        assignee: userId,
        createdBy: userId,
      });
      taskId = task._id.toString();
    });

    it('should update task successfully', async () => {
      const updateData = {
        title: 'Updated Task',
        description: 'Updated description',
        status: 'in-progress',
        priority: 'high',
      };

      const response = await request(app)
        .put(`/api/task/update/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.data.title).toBe(updateData.title);
      expect(response.body.data.description).toBe(updateData.description);
      expect(response.body.data.status).toBe(updateData.status);
      expect(response.body.data.priority).toBe(updateData.priority);
    });

    it('should allow admin to update any task', async () => {
      const updateData = {
        title: 'Admin Updated Task',
      };

      const response = await request(app)
        .put(`/api/task/update/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should fail with invalid task ID', async () => {
      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put('/api/task/update/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const updateData = {
        title: 'Updated Task',
      };

      const response = await request(app)
        .put(`/api/task/update/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const updateData = {
        title: 'Unauthorized Update',
      };

      const response = await request(app)
        .put(`/api/task/update/${taskId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/task/delete/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const task = await global.testUtils.createTestTask({
        title: 'Task to Delete',
        assignee: userId,
        createdBy: userId,
      });
      taskId = task._id.toString();
    });

    it('should delete task successfully', async () => {
      const response = await request(app)
        .delete(`/api/task/delete/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify task is deleted
      const deletedTask = await TaskModel.findById(taskId);
      expect(deletedTask).toBeNull();
    });

    it('should allow admin to delete any task', async () => {
      const response = await request(app)
        .delete(`/api/task/delete/${taskId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should fail with invalid task ID', async () => {
      const response = await request(app)
        .delete('/api/task/delete/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail when task not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();

      const response = await request(app)
        .delete(`/api/task/delete/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete(`/api/task/delete/${taskId}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Task Validation', () => {
    it('should validate task title length', async () => {
      const longTitle = 'a'.repeat(101); // Exceeds 100 character limit
      const taskData = {
        title: longTitle,
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate task description length', async () => {
      const longDescription = 'a'.repeat(1001); // Exceeds 1000 character limit
      const taskData = {
        title: 'Valid Title',
        description: longDescription,
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate tags array length', async () => {
      const manyTags = Array.from({ length: 11 }, (_, i) => `tag${i}`); // Exceeds 10 tag limit
      const taskData = {
        title: 'Valid Title',
        tags: manyTags,
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate individual tag length', async () => {
      const longTag = 'a'.repeat(11); // Exceeds 10 character limit
      const taskData = {
        title: 'Valid Title',
        tags: [longTag],
      };

      const response = await request(app)
        .post('/api/task/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });
});
