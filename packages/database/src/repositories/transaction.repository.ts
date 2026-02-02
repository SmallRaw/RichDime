/**
 * 交易记录 Repository
 * 纯数据访问层 — Drizzle ORM 重写
 */

import { eq, and, desc, sql, gte, lte, like, or, inArray } from 'drizzle-orm';
import { getDrizzle, generateId, type DrizzleTransaction } from '../connection';
import { now } from '../utils/date';
import { transactions } from '../schema/tables';
import type {
  Transaction,
  TransactionType,
  TransactionFilter,
  PaginationParams,
  PaginatedResult,
} from '../models/types';

type TransactionRow = typeof transactions.$inferSelect;

/** 将 Drizzle 行转换为 Transaction 实体 */
function rowToTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    type: row.type,
    amount: row.amount,
    categoryId: row.categoryId,
    accountId: row.accountId,
    toAccountId: row.toAccountId,
    note: row.note,
    date: row.date,
    tags: JSON.parse(row.tags),
    attachments: JSON.parse(row.attachments),
    recurringId: row.recurringId,
    isVoid: row.isVoid,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * 构建 Drizzle where 条件
 */
function buildFilterConditions(filter: TransactionFilter) {
  const conditions = [];

  if (!filter.includeVoid) {
    conditions.push(eq(transactions.isVoid, false));
  }

  if (filter.type) {
    conditions.push(eq(transactions.type, filter.type));
  }

  if (filter.categoryId) {
    conditions.push(eq(transactions.categoryId, filter.categoryId));
  }

  if (filter.categoryIds && filter.categoryIds.length > 0) {
    conditions.push(inArray(transactions.categoryId, filter.categoryIds));
  }

  if (filter.accountId) {
    conditions.push(
      or(
        eq(transactions.accountId, filter.accountId),
        eq(transactions.toAccountId, filter.accountId)
      )!
    );
  }

  if (filter.accountIds && filter.accountIds.length > 0) {
    conditions.push(
      or(
        inArray(transactions.accountId, filter.accountIds),
        inArray(transactions.toAccountId, filter.accountIds)
      )!
    );
  }

  if (filter.dateRange) {
    conditions.push(gte(transactions.date, filter.dateRange.start));
    conditions.push(lte(transactions.date, filter.dateRange.end));
  }

  if (filter.minAmount !== undefined) {
    conditions.push(gte(transactions.amount, filter.minAmount));
  }

  if (filter.maxAmount !== undefined) {
    conditions.push(lte(transactions.amount, filter.maxAmount));
  }

  if (filter.tags && filter.tags.length > 0) {
    const tagConditions = filter.tags.map((tag) => like(transactions.tags, `%"${tag}"%`));
    conditions.push(or(...tagConditions)!);
  }

  if (filter.searchText) {
    conditions.push(like(transactions.note, `%${filter.searchText}%`));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

/**
 * 获取交易列表（分页）
 */
export async function getTransactions(
  filter: TransactionFilter = {},
  pagination?: PaginationParams,
  tx?: DrizzleTransaction
): Promise<PaginatedResult<Transaction>> {
  const db = tx ?? await getDrizzle();
  const whereCondition = buildFilterConditions(filter);

  // Count
  const countResult = await db.select({ count: sql<number>`COUNT(*)` })
    .from(transactions)
    .where(whereCondition);
  const total = countResult[0]?.count ?? 0;

  // Pagination
  const page = pagination?.page ?? 1;
  const pageSize = pagination?.pageSize ?? 20;
  const offset = (page - 1) * pageSize;

  // Data
  const query = db.select().from(transactions)
    .where(whereCondition)
    .orderBy(desc(transactions.date), desc(transactions.createdAt))
    .limit(pageSize)
    .offset(offset);

  const rows = await query;

  return {
    data: rows.map(rowToTransaction),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

/**
 * 获取所有交易（无分页）
 */
export async function getAllTransactions(filter: TransactionFilter = {}, tx?: DrizzleTransaction): Promise<Transaction[]> {
  const db = tx ?? await getDrizzle();
  const whereCondition = buildFilterConditions(filter);

  const rows = await db.select().from(transactions)
    .where(whereCondition)
    .orderBy(desc(transactions.date), desc(transactions.createdAt));

  return rows.map(rowToTransaction);
}

/**
 * 根据 ID 获取交易
 */
export async function getTransactionById(id: string, tx?: DrizzleTransaction): Promise<Transaction | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  return rows.length > 0 ? rowToTransaction(rows[0]) : null;
}

/**
 * 插入交易记录（纯数据操作）
 */
export async function insertTransaction(
  data: {
    id?: string;
    type: TransactionType;
    amount: number;
    categoryId: string;
    accountId: string;
    toAccountId?: string | null;
    note?: string;
    date: number;
    tags?: string[];
    attachments?: string[];
    recurringId?: string | null;
  },
  tx?: DrizzleTransaction
): Promise<Transaction> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();
  const id = data.id ?? generateId();

  await db.insert(transactions).values({
    id,
    type: data.type,
    amount: data.amount,
    categoryId: data.categoryId,
    accountId: data.accountId,
    toAccountId: data.toAccountId ?? null,
    note: data.note ?? '',
    date: data.date,
    tags: JSON.stringify(data.tags ?? []),
    attachments: JSON.stringify(data.attachments ?? []),
    recurringId: data.recurringId ?? null,
    isVoid: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const transaction = await getTransactionById(id, tx);
  if (!transaction) {
    throw new Error('Failed to create transaction');
  }
  return transaction;
}

/**
 * 更新交易字段（纯数据操作）
 */
export async function updateTransactionFields(
  id: string,
  fields: Partial<{
    type: TransactionType;
    amount: number;
    categoryId: string;
    accountId: string;
    toAccountId: string | null;
    note: string;
    date: number;
    tags: string[];
    attachments: string[];
    isVoid: boolean;
  }>,
  tx?: DrizzleTransaction
): Promise<Transaction> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const updates: Partial<typeof transactions.$inferInsert> = { updatedAt: timestamp };

  if (fields.type !== undefined) updates.type = fields.type;
  if (fields.amount !== undefined) updates.amount = fields.amount;
  if (fields.categoryId !== undefined) updates.categoryId = fields.categoryId;
  if (fields.accountId !== undefined) updates.accountId = fields.accountId;
  if (fields.toAccountId !== undefined) updates.toAccountId = fields.toAccountId;
  if (fields.note !== undefined) updates.note = fields.note;
  if (fields.date !== undefined) updates.date = fields.date;
  if (fields.tags !== undefined) updates.tags = JSON.stringify(fields.tags);
  if (fields.attachments !== undefined) updates.attachments = JSON.stringify(fields.attachments);
  if (fields.isVoid !== undefined) updates.isVoid = fields.isVoid;

  await db.update(transactions).set(updates).where(eq(transactions.id, id));

  const transaction = await getTransactionById(id, tx);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  return transaction;
}

/**
 * 删除交易行（纯数据操作）
 */
export async function deleteTransactionRow(id: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();
  await db.delete(transactions).where(eq(transactions.id, id));
}

/**
 * 获取按日期分组的交易
 */
export async function getTransactionsGroupedByDate(
  filter: TransactionFilter = {},
  pagination?: PaginationParams,
  tx?: DrizzleTransaction
): Promise<{
  groups: Array<{ date: string; dateTimestamp: number; transactions: Transaction[] }>;
  pagination: PaginatedResult<Transaction>;
}> {
  const result = await getTransactions(filter, pagination, tx);

  const groupMap = new Map<string, { dateTimestamp: number; transactions: Transaction[] }>();

  for (const transaction of result.data) {
    const d = new Date(transaction.date);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (!groupMap.has(dateKey)) {
      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      groupMap.set(dateKey, { dateTimestamp: dayStart, transactions: [] });
    }
    groupMap.get(dateKey)!.transactions.push(transaction);
  }

  const groups = Array.from(groupMap.entries())
    .map(([date, { dateTimestamp, transactions: txns }]) => ({ date, dateTimestamp, transactions: txns }))
    .sort((a, b) => b.dateTimestamp - a.dateTimestamp);

  return { groups, pagination: result };
}

/**
 * 根据循环记账 ID 获取交易记录
 */
export async function getTransactionsByRecurringId(recurringId: string, tx?: DrizzleTransaction): Promise<Transaction[]> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(transactions)
    .where(eq(transactions.recurringId, recurringId))
    .orderBy(desc(transactions.date));

  return rows.map(rowToTransaction);
}

/**
 * 清除指定循环记账关联（设置 recurring_id = null）
 */
export async function clearRecurringId(recurringId: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();
  await db.update(transactions).set({ recurringId: null })
    .where(eq(transactions.recurringId, recurringId));
}
