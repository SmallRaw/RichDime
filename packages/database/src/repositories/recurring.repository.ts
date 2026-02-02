/**
 * 循环记账 Repository
 * 纯数据访问层 — Drizzle ORM 重写
 */

import { eq, and, lte, asc, gt, isNull, or, sql } from 'drizzle-orm';
import { getDrizzle, generateId, type DrizzleTransaction } from '../connection';
import { now, calculateNextExecuteDate, startOfDay } from '../utils/date';
import { recurringTransactions } from '../schema/tables';
import type {
  RecurringTransaction,
  TransactionType,
  RecurrenceFrequency,
  DayOfWeek,
  CreateRecurringTransactionDTO,
  UpdateRecurringTransactionDTO,
} from '../models/types';

type RecurringRow = typeof recurringTransactions.$inferSelect;

/** 将 Drizzle 行转换为 RecurringTransaction 实体 */
function rowToRecurringTransaction(row: RecurringRow): RecurringTransaction {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    amount: row.amount,
    categoryId: row.categoryId,
    accountId: row.accountId,
    toAccountId: row.toAccountId,
    note: row.note,
    tags: JSON.parse(row.tags),
    frequency: row.frequency,
    dayOfMonth: row.dayOfMonth,
    dayOfWeek: row.dayOfWeek as DayOfWeek | null,
    startDate: row.startDate,
    endDate: row.endDate,
    lastExecutedAt: row.lastExecutedAt,
    nextExecuteAt: row.nextExecuteAt,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * 获取所有循环记账
 */
export async function getAllRecurringTransactions(
  activeOnly: boolean = true,
  tx?: DrizzleTransaction
): Promise<RecurringTransaction[]> {
  const db = tx ?? await getDrizzle();

  const rows = activeOnly
    ? await db.select().from(recurringTransactions)
        .where(eq(recurringTransactions.isActive, true))
        .orderBy(asc(recurringTransactions.nextExecuteAt))
    : await db.select().from(recurringTransactions)
        .orderBy(asc(recurringTransactions.nextExecuteAt));

  return rows.map(rowToRecurringTransaction);
}

/**
 * 根据 ID 获取循环记账
 */
export async function getRecurringTransactionById(id: string, tx?: DrizzleTransaction): Promise<RecurringTransaction | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(recurringTransactions)
    .where(eq(recurringTransactions.id, id)).limit(1);
  return rows.length > 0 ? rowToRecurringTransaction(rows[0]) : null;
}

/**
 * 获取待执行的循环记账
 */
export async function getDueRecurringTransactions(tx?: DrizzleTransaction): Promise<RecurringTransaction[]> {
  const db = tx ?? await getDrizzle();
  const today = startOfDay();

  const rows = await db.select().from(recurringTransactions)
    .where(and(
      eq(recurringTransactions.isActive, true),
      lte(recurringTransactions.nextExecuteAt, today),
      or(
        isNull(recurringTransactions.endDate),
        sql`${recurringTransactions.endDate} >= ${today}`
      )
    ))
    .orderBy(asc(recurringTransactions.nextExecuteAt));

  return rows.map(rowToRecurringTransaction);
}

/**
 * 创建循环记账
 */
export async function createRecurringTransaction(
  dto: CreateRecurringTransactionDTO,
  tx?: DrizzleTransaction
): Promise<RecurringTransaction> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();
  const id = generateId();

  if (dto.type === 'transfer' && !dto.toAccountId) {
    throw new Error('Transfer recurring transaction requires toAccountId');
  }

  const nextExecuteAt = calculateNextExecuteDate(
    dto.frequency,
    null,
    dto.startDate,
    dto.dayOfMonth ?? null,
    dto.dayOfWeek ?? null
  );

  await db.insert(recurringTransactions).values({
    id,
    name: dto.name,
    type: dto.type,
    amount: dto.amount,
    categoryId: dto.categoryId,
    accountId: dto.accountId,
    toAccountId: dto.toAccountId ?? null,
    note: dto.note ?? '',
    tags: JSON.stringify(dto.tags ?? []),
    frequency: dto.frequency,
    dayOfMonth: dto.dayOfMonth ?? null,
    dayOfWeek: dto.dayOfWeek ?? null,
    startDate: dto.startDate,
    endDate: dto.endDate ?? null,
    lastExecutedAt: null,
    nextExecuteAt,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const recurring = await getRecurringTransactionById(id, tx);
  if (!recurring) {
    throw new Error('Failed to create recurring transaction');
  }
  return recurring;
}

/**
 * 更新循环记账
 */
export async function updateRecurringTransaction(
  id: string,
  dto: UpdateRecurringTransactionDTO,
  tx?: DrizzleTransaction
): Promise<RecurringTransaction> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const existing = await getRecurringTransactionById(id, tx);
  if (!existing) {
    throw new Error('Recurring transaction not found');
  }

  const updates: Partial<typeof recurringTransactions.$inferInsert> = { updatedAt: timestamp };

  if (dto.name !== undefined) updates.name = dto.name;
  if (dto.type !== undefined) updates.type = dto.type;
  if (dto.amount !== undefined) updates.amount = dto.amount;
  if (dto.categoryId !== undefined) updates.categoryId = dto.categoryId;
  if (dto.accountId !== undefined) updates.accountId = dto.accountId;
  if (dto.toAccountId !== undefined) updates.toAccountId = dto.toAccountId ?? null;
  if (dto.note !== undefined) updates.note = dto.note;
  if (dto.tags !== undefined) updates.tags = JSON.stringify(dto.tags);
  if (dto.frequency !== undefined) updates.frequency = dto.frequency;
  if (dto.dayOfMonth !== undefined) updates.dayOfMonth = dto.dayOfMonth;
  if (dto.dayOfWeek !== undefined) updates.dayOfWeek = dto.dayOfWeek ?? null;
  if (dto.startDate !== undefined) updates.startDate = dto.startDate;
  if (dto.endDate !== undefined) updates.endDate = dto.endDate ?? null;
  if (dto.isActive !== undefined) updates.isActive = dto.isActive;

  // Recalculate next execute date if needed
  const needsRecalculate =
    dto.frequency !== undefined ||
    dto.dayOfMonth !== undefined ||
    dto.dayOfWeek !== undefined ||
    dto.startDate !== undefined;

  if (needsRecalculate) {
    updates.nextExecuteAt = calculateNextExecuteDate(
      dto.frequency ?? existing.frequency,
      existing.lastExecutedAt,
      dto.startDate ?? existing.startDate,
      dto.dayOfMonth !== undefined ? dto.dayOfMonth : existing.dayOfMonth,
      dto.dayOfWeek !== undefined ? dto.dayOfWeek : existing.dayOfWeek
    );
  }

  await db.update(recurringTransactions).set(updates).where(eq(recurringTransactions.id, id));

  const recurring = await getRecurringTransactionById(id, tx);
  if (!recurring) {
    throw new Error('Recurring transaction not found');
  }
  return recurring;
}

/**
 * 标记循环记账已执行
 */
export async function markRecurringTransactionExecuted(id: string, tx?: DrizzleTransaction): Promise<RecurringTransaction> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const existing = await getRecurringTransactionById(id, tx);
  if (!existing) {
    throw new Error('Recurring transaction not found');
  }

  const executedAt = startOfDay();
  const nextExecuteAt = calculateNextExecuteDate(
    existing.frequency,
    executedAt,
    existing.startDate,
    existing.dayOfMonth,
    existing.dayOfWeek
  );

  await db.update(recurringTransactions).set({
    lastExecutedAt: executedAt,
    nextExecuteAt,
    updatedAt: timestamp,
  }).where(eq(recurringTransactions.id, id));

  const recurring = await getRecurringTransactionById(id, tx);
  if (!recurring) {
    throw new Error('Recurring transaction not found');
  }
  return recurring;
}

/**
 * 删除循环记账
 */
export async function deleteRecurringTransaction(id: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();

  // 清除关联交易的 recurring_id
  await db.all(sql`UPDATE transactions SET recurring_id = NULL WHERE recurring_id = ${id}`);

  await db.delete(recurringTransactions).where(eq(recurringTransactions.id, id));
}

/**
 * 停用循环记账
 */
export async function deactivateRecurringTransaction(id: string, tx?: DrizzleTransaction): Promise<RecurringTransaction> {
  return updateRecurringTransaction(id, { isActive: false }, tx);
}

/**
 * 启用循环记账
 */
export async function activateRecurringTransaction(id: string, tx?: DrizzleTransaction): Promise<RecurringTransaction> {
  const db = tx ?? await getDrizzle();
  const recurring = await updateRecurringTransaction(id, { isActive: true }, tx);

  // Recalculate from today
  const nextExecuteAt = calculateNextExecuteDate(
    recurring.frequency,
    null,
    startOfDay(),
    recurring.dayOfMonth,
    recurring.dayOfWeek
  );

  await db.update(recurringTransactions).set({
    nextExecuteAt,
    updatedAt: now(),
  }).where(eq(recurringTransactions.id, id));

  return getRecurringTransactionById(id, tx) as Promise<RecurringTransaction>;
}

/**
 * 获取即将到期的循环记账
 */
export async function getUpcomingRecurringTransactions(
  days: number = 7,
  tx?: DrizzleTransaction
): Promise<RecurringTransaction[]> {
  const db = tx ?? await getDrizzle();
  const today = startOfDay();
  const futureDate = today + days * 24 * 60 * 60 * 1000;

  const rows = await db.select().from(recurringTransactions)
    .where(and(
      eq(recurringTransactions.isActive, true),
      gt(recurringTransactions.nextExecuteAt, today),
      lte(recurringTransactions.nextExecuteAt, futureDate),
      or(
        isNull(recurringTransactions.endDate),
        sql`${recurringTransactions.endDate} >= ${today}`
      )
    ))
    .orderBy(asc(recurringTransactions.nextExecuteAt));

  return rows.map(rowToRecurringTransaction);
}
