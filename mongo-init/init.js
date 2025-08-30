db = db.getSiblingDB('taskify');

db.createCollection('users');
db.createCollection('tasks');
db.createCollection('activitylogs');

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "role": 1 });
db.users.createIndex({ "status": 1 });

db.tasks.createIndex({ "assignee": 1 });
db.tasks.createIndex({ "createdBy": 1 });
db.tasks.createIndex({ "status": 1 });
db.tasks.createIndex({ "priority": 1 });
db.tasks.createIndex({ "dueDate": 1 });

db.activitylogs.createIndex({ "userId": 1 });
db.activitylogs.createIndex({ "action": 1 });
db.activitylogs.createIndex({ "createdAt": 1 });

print('Database initialized successfully!');
