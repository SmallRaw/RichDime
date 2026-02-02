/**
 * Drizzle ORM 表定义
 * 精确匹配现有 SQLite Schema（migrations/schema.ts）
 */

import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// ============ 账户表 ============

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['cash', 'bank', 'credit', 'investment', 'other'] }).notNull(),
  currency: text('currency').notNull().default('CNY'),
  balance: integer('balance').notNull().default(0),
  initialBalance: integer('initial_balance').notNull().default(0),
  icon: text('icon').notNull().default('wallet'),
  color: text('color').notNull().default('#6366f1'),
  isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// ============ 分类表 ============

export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
    icon: text('icon').notNull().default('folder'),
    color: text('color').notNull().default('#6366f1'),
    parentId: text('parent_id').references((): any => categories.id, { onDelete: 'set null' }),
    isSystem: integer('is_system', { mode: 'boolean' }).notNull().default(false),
    isArchived: integer('is_archived', { mode: 'boolean' }).notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_categories_type').on(table.type),
    index('idx_categories_parent_id').on(table.parentId),
  ]
);

// ============ 交易记录表 ============

export const transactions = sqliteTable(
  'transactions',
  {
    id: text('id').primaryKey(),
    type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
    amount: integer('amount').notNull(),
    categoryId: text('category_id').notNull().references(() => categories.id),
    accountId: text('account_id').notNull().references(() => accounts.id),
    toAccountId: text('to_account_id').references(() => accounts.id),
    note: text('note').notNull().default(''),
    date: integer('date').notNull(),
    tags: text('tags').notNull().default('[]'),
    attachments: text('attachments').notNull().default('[]'),
    recurringId: text('recurring_id'),
    isVoid: integer('is_void', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at').notNull(),
    updatedAt: integer('updated_at').notNull(),
  },
  (table) => [
    index('idx_transactions_date').on(table.date),
    index('idx_transactions_type').on(table.type),
    index('idx_transactions_category_id').on(table.categoryId),
    index('idx_transactions_account_id').on(table.accountId),
    index('idx_transactions_recurring_id').on(table.recurringId),
  ]
);

// ============ 循环记账表 ============

export const recurringTransactions = sqliteTable('recurring_transactions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type', { enum: ['expense', 'income', 'transfer'] }).notNull(),
  amount: integer('amount').notNull(),
  categoryId: text('category_id').notNull().references(() => categories.id),
  accountId: text('account_id').notNull().references(() => accounts.id),
  toAccountId: text('to_account_id').references(() => accounts.id),
  note: text('note').notNull().default(''),
  tags: text('tags').notNull().default('[]'),
  frequency: text('frequency', {
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly'],
  }).notNull(),
  dayOfMonth: integer('day_of_month'),
  dayOfWeek: integer('day_of_week'),
  startDate: integer('start_date').notNull(),
  endDate: integer('end_date'),
  lastExecutedAt: integer('last_executed_at'),
  nextExecuteAt: integer('next_execute_at').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// ============ 预算表 ============

export const budgets = sqliteTable('budgets', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  categoryId: text('category_id').references(() => categories.id),
  accountId: text('account_id').references(() => accounts.id),
  amount: integer('amount').notNull(),
  frequency: text('frequency', { enum: ['monthly', 'yearly'] }).notNull(),
  startDate: integer('start_date').notNull(),
  endDate: integer('end_date'),
  alertThreshold: integer('alert_threshold').notNull().default(80),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// ============ Schema 版本表 ============

export const schemaVersion = sqliteTable('schema_version', {
  version: integer('version').primaryKey(),
});
