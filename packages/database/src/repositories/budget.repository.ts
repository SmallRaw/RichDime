/**
 * 预算 Repository
 * 纯数据访问层 — Drizzle ORM 重写
 */

import { eq, asc, sql } from 'drizzle-orm';
import { getDrizzle, generateId, type DrizzleTransaction } from '../connection';
import { now, startOfMonth, endOfMonth, startOfYear, endOfYear } from '../utils/date';
import { budgets } from '../schema/tables';
import type {
  Budget,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from '../models/types';

type BudgetRow = typeof budgets.$inferSelect;

/** 将 Drizzle 行转换为 Budget 实体 */
function rowToBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.categoryId,
    accountId: row.accountId,
    amount: row.amount,
    frequency: row.frequency,
    startDate: row.startDate,
    endDate: row.endDate,
    alertThreshold: row.alertThreshold,
    isActive: row.isActive,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * 获取所有预算
 */
export async function getAllBudgets(activeOnly: boolean = true, tx?: DrizzleTransaction): Promise<Budget[]> {
  const db = tx ?? await getDrizzle();

  const rows = activeOnly
    ? await db.select().from(budgets).where(eq(budgets.isActive, true)).orderBy(asc(budgets.createdAt))
    : await db.select().from(budgets).orderBy(asc(budgets.createdAt));

  return rows.map(rowToBudget);
}

/**
 * 根据 ID 获取预算
 */
export async function getBudgetById(id: string, tx?: DrizzleTransaction): Promise<Budget | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(budgets).where(eq(budgets.id, id)).limit(1);
  return rows.length > 0 ? rowToBudget(rows[0]) : null;
}

/**
 * 获取分类的预算
 */
export async function getBudgetByCategory(categoryId: string, tx?: DrizzleTransaction): Promise<Budget | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(budgets)
    .where(sql`${budgets.categoryId} = ${categoryId} AND ${budgets.isActive} = 1`)
    .limit(1);
  return rows.length > 0 ? rowToBudget(rows[0]) : null;
}

/**
 * 创建预算
 */
export async function createBudget(dto: CreateBudgetDTO, tx?: DrizzleTransaction): Promise<Budget> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();
  const id = generateId();
  const startDate = dto.startDate ?? startOfMonth();

  await db.insert(budgets).values({
    id,
    name: dto.name,
    categoryId: dto.categoryId ?? null,
    accountId: dto.accountId ?? null,
    amount: dto.amount,
    frequency: dto.frequency,
    startDate,
    endDate: dto.endDate ?? null,
    alertThreshold: dto.alertThreshold ?? 80,
    isActive: true,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const budget = await getBudgetById(id, tx);
  if (!budget) {
    throw new Error('Failed to create budget');
  }
  return budget;
}

/**
 * 更新预算
 */
export async function updateBudget(id: string, dto: UpdateBudgetDTO, tx?: DrizzleTransaction): Promise<Budget> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const updates: Partial<typeof budgets.$inferInsert> = { updatedAt: timestamp };

  if (dto.name !== undefined) updates.name = dto.name;
  if (dto.categoryId !== undefined) updates.categoryId = dto.categoryId ?? null;
  if (dto.accountId !== undefined) updates.accountId = dto.accountId ?? null;
  if (dto.amount !== undefined) updates.amount = dto.amount;
  if (dto.frequency !== undefined) updates.frequency = dto.frequency;
  if (dto.startDate !== undefined) updates.startDate = dto.startDate;
  if (dto.endDate !== undefined) updates.endDate = dto.endDate ?? null;
  if (dto.alertThreshold !== undefined) updates.alertThreshold = dto.alertThreshold;
  if (dto.isActive !== undefined) updates.isActive = dto.isActive;

  await db.update(budgets).set(updates).where(eq(budgets.id, id));

  const budget = await getBudgetById(id, tx);
  if (!budget) {
    throw new Error('Budget not found');
  }
  return budget;
}

/**
 * 删除预算
 */
export async function deleteBudget(id: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();
  await db.delete(budgets).where(eq(budgets.id, id));
}
