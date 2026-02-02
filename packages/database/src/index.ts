/**
 * @rich-dime/database
 * 记账应用数据库层
 */

// 数据库连接
export {
  getDatabase,
  initializeDatabase,
  closeDatabase,
  resetDatabase,
  generateId,
  withTransaction,
  getDrizzle,
  withDrizzleTransaction,
  type DrizzleDB,
  type DrizzleTransaction,
} from './connection';

// 数据模型
export * from './models';

// 数据仓库
export * from './repositories';

// 业务服务
export * from './services';

// 工具函数
export * from './utils';
