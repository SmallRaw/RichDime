/**
 * 数据库连接管理
 */

import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as Crypto from 'expo-crypto';
import { INIT_SCHEMA, SCHEMA_VERSION, DEFAULT_CATEGORIES, DEFAULT_ACCOUNTS } from './migrations/schema';
import { now } from './utils/date';
import * as schema from './schema';

const DB_NAME = 'rich-dime.db';

let dbInstance: SQLite.SQLiteDatabase | null = null;
let drizzleInstance: ExpoSQLiteDatabase<typeof schema> | null = null;

/** Drizzle 数据库类型 */
export type DrizzleDB = ExpoSQLiteDatabase<typeof schema>;

/** Drizzle 事务类型 */
export type DrizzleTransaction = Parameters<Parameters<DrizzleDB['transaction']>[0]>[0];

/**
 * 获取数据库实例（单例模式）
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  dbInstance = await SQLite.openDatabaseAsync(DB_NAME);
  return dbInstance;
}

/**
 * 初始化数据库
 * 创建表结构和初始数据
 */
export async function initializeDatabase(): Promise<void> {
  const db = await getDatabase();

  // 开启 WAL 模式以提高性能
  await db.execAsync('PRAGMA journal_mode = WAL;');

  // 开启外键约束
  await db.execAsync('PRAGMA foreign_keys = ON;');

  // 检查是否需要初始化
  const needsInit = await checkNeedsInitialization(db);

  if (needsInit) {
    // 执行初始化 schema
    await db.execAsync(INIT_SCHEMA);

    // 插入 schema 版本
    await db.runAsync('INSERT OR REPLACE INTO schema_version (version) VALUES (?)', SCHEMA_VERSION);

    // 插入默认分类
    await insertDefaultCategories(db);

    // 插入默认账户
    await insertDefaultAccounts(db);

    console.log('[Database] Initialized with schema version:', SCHEMA_VERSION);
  } else {
    // 检查是否需要迁移
    await checkAndMigrate(db);
  }
}

/**
 * 检查是否需要初始化
 */
async function checkNeedsInitialization(db: SQLite.SQLiteDatabase): Promise<boolean> {
  try {
    const result = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version LIMIT 1');
    return result === null;
  } catch {
    // 表不存在，需要初始化
    return true;
  }
}

/**
 * 检查并执行数据库迁移
 */
async function checkAndMigrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ version: number }>('SELECT version FROM schema_version LIMIT 1');
  const currentVersion = result?.version ?? 0;

  if (currentVersion < SCHEMA_VERSION) {
    // 执行迁移（未来扩展）
    // await runMigrations(db, currentVersion, SCHEMA_VERSION);
    await db.runAsync('UPDATE schema_version SET version = ?', SCHEMA_VERSION);
    console.log('[Database] Migrated from version', currentVersion, 'to', SCHEMA_VERSION);
  }
}

/**
 * 插入默认分类
 */
async function insertDefaultCategories(db: SQLite.SQLiteDatabase): Promise<void> {
  const timestamp = now();

  for (const cat of DEFAULT_CATEGORIES) {
    await db.runAsync(
      `INSERT INTO categories (id, name, type, icon, color, parent_id, is_system, is_archived, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, NULL, 1, 0, ?, ?, ?)`,
      cat.id,
      cat.name,
      cat.type,
      cat.icon,
      cat.color,
      cat.sortOrder,
      timestamp,
      timestamp
    );
  }

  console.log('[Database] Inserted', DEFAULT_CATEGORIES.length, 'default categories');
}

/**
 * 插入默认账户
 */
async function insertDefaultAccounts(db: SQLite.SQLiteDatabase): Promise<void> {
  const timestamp = now();

  for (const acc of DEFAULT_ACCOUNTS) {
    await db.runAsync(
      `INSERT INTO accounts (id, name, type, currency, balance, initial_balance, icon, color, is_archived, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, 'CNY', 0, 0, ?, ?, 0, ?, ?, ?)`,
      acc.id,
      acc.name,
      acc.type,
      acc.icon,
      acc.color,
      acc.sortOrder,
      timestamp,
      timestamp
    );
  }

  console.log('[Database] Inserted', DEFAULT_ACCOUNTS.length, 'default accounts');
}

/**
 * 生成 UUID
 */
export function generateId(): string {
  return Crypto.randomUUID();
}

/**
 * 关闭数据库连接
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
    drizzleInstance = null;
    console.log('[Database] Connection closed');
  }
}

/**
 * 重置数据库（危险操作，仅用于开发/测试）
 */
export async function resetDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }

  drizzleInstance = null;
  await SQLite.deleteDatabaseAsync(DB_NAME);
  console.log('[Database] Database reset');

  // 重新初始化
  await initializeDatabase();
}

/**
 * 执行事务（原生 SQLite）
 */
export async function withTransaction<T>(
  callback: (db: SQLite.SQLiteDatabase) => Promise<T>
): Promise<T> {
  const db = await getDatabase();

  await db.execAsync('BEGIN TRANSACTION');

  try {
    const result = await callback(db);
    await db.execAsync('COMMIT');
    return result;
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
}

/**
 * 获取 Drizzle ORM 实例（单例模式）
 */
export async function getDrizzle(): Promise<DrizzleDB> {
  if (drizzleInstance) {
    return drizzleInstance;
  }

  const db = await getDatabase();
  drizzleInstance = drizzle(db, { schema });
  return drizzleInstance;
}

/**
 * 使用 Drizzle 事务
 */
export async function withDrizzleTransaction<T>(
  callback: (tx: DrizzleTransaction) => Promise<T>
): Promise<T> {
  const db = await getDrizzle();
  return db.transaction(callback);
}
