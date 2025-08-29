export enum UserRoleEnum {
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum TaskStatusEnum {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export enum TaskPriorityEnum {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ActivityActionEnum {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

export enum TokenTypeEnum {
  Auth = 'auth',
  Refresh = 'refresh',
  Invite = 'invite',
  Reset = 'reset',
  Verify = 'verify',
}

export enum UserStatusEnum {
  Active= 'active',
  Bloacked = 'blocked',
}
