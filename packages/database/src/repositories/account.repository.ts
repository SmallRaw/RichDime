/**
 * 账户 Repository
 * 纯数据访问层 — Drizzle ORM 重写
 */

import { eq, sql, asc } from 'drizzle-orm';
import { getDrizzle, generateId, type DrizzleTransaction } from '../connection';
import { now } from '../utils/date';
import { accounts } from '../schema/tables';
import type {
  Account,
  CreateAccountDTO,
  UpdateAccountDTO,
} from '../models/types';

type AccountRow = typeof accounts.$inferSelect;

/** 将 Drizzle 行转换为 Account 实体 */
function rowToAccount(row: AccountRow): Account {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    currency: row.currency as Account['currency'],
    balance: row.balance,
    initialBalance: row.initialBalance,
    icon: row.icon,
    color: row.color,
    isArchived: row.isArchived,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * 获取所有账户
 */
export async function getAllAccounts(includeArchived: boolean = false, tx?: DrizzleTransaction): Promise<Account[]> {
  const db = tx ?? await getDrizzle();

  const rows = includeArchived
    ? await db.select().from(accounts).orderBy(asc(accounts.sortOrder), asc(accounts.createdAt))
    : await db.select().from(accounts)
        .where(eq(accounts.isArchived, false))
        .orderBy(asc(accounts.sortOrder), asc(accounts.createdAt));

  return rows.map(rowToAccount);
}

/**
 * 根据 ID 获取账户
 */
export async function getAccountById(id: string, tx?: DrizzleTransaction): Promise<Account | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(accounts).where(eq(accounts.id, id)).limit(1);
  return rows.length > 0 ? rowToAccount(rows[0]) : null;
}

/**
 * 创建账户
 */
export async function createAccount(dto: CreateAccountDTO, tx?: DrizzleTransaction): Promise<Account> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();
  const id = generateId();
  const initialBalance = dto.initialBalance ?? 0;

  await db.insert(accounts).values({
    id,
    name: dto.name,
    type: dto.type,
    currency: dto.currency ?? 'CNY',
    balance: initialBalance,
    initialBalance,
    icon: dto.icon ?? 'wallet',
    color: dto.color ?? '#6366f1',
    isArchived: false,
    sortOrder: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const account = await getAccountById(id, tx);
  if (!account) {
    throw new Error('Failed to create account');
  }
  return account;
}

/**
 * 更新账户
 */
export async function updateAccount(id: string, dto: UpdateAccountDTO, tx?: DrizzleTransaction): Promise<Account> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const updates: Partial<typeof accounts.$inferInsert> = { updatedAt: timestamp };

  if (dto.name !== undefined) updates.name = dto.name;
  if (dto.type !== undefined) updates.type = dto.type;
  if (dto.icon !== undefined) updates.icon = dto.icon;
  if (dto.color !== undefined) updates.color = dto.color;
  if (dto.isArchived !== undefined) updates.isArchived = dto.isArchived;
  if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;

  await db.update(accounts).set(updates).where(eq(accounts.id, id));

  const account = await getAccountById(id, tx);
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
}

/**
 * 删除账户（纯数据操作，不含业务校验）
 */
export async function deleteAccountRow(id: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();
  await db.delete(accounts).where(eq(accounts.id, id));
}

/**
 * 更新账户余额（原子增减）
 */
export async function updateAccountBalance(
  id: string,
  amountChange: number,
  tx?: DrizzleTransaction
): Promise<void> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  await db.update(accounts).set({
    balance: sql`${accounts.balance} + ${amountChange}`,
    updatedAt: timestamp,
  }).where(eq(accounts.id, id));
}

/**
 * 设置账户余额（绝对值）
 */
export async function setAccountBalance(
  id: string,
  newBalance: number,
  tx?: DrizzleTransaction
): Promise<void> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  await db.update(accounts).set({
    balance: newBalance,
    updatedAt: timestamp,
  }).where(eq(accounts.id, id));
}

/**
 * 获取账户总余额
 */
export async function getTotalBalance(tx?: DrizzleTransaction): Promise<number> {
  const db = tx ?? await getDrizzle();
  const result = await db.select({
    total: sql<number>`COALESCE(SUM(${accounts.balance}), 0)`,
  }).from(accounts).where(eq(accounts.isArchived, false));
  return result[0]?.total ?? 0;
}

/**
 * 批量更新账户排序
 */
export async function updateAccountSortOrder(
  orders: Array<{ id: string; sortOrder: number }>,
  tx?: DrizzleTransaction
): Promise<void> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  for (const { id, sortOrder } of orders) {
    await db.update(accounts).set({
      sortOrder,
      updatedAt: timestamp,
    }).where(eq(accounts.id, id));
  }
}

/**
 * 获取账户关联交易数量
 */
export async function getAccountTransactionCount(id: string, tx?: DrizzleTransaction): Promise<number> {
  const db = tx ?? await getDrizzle();
  // Use raw sql to reference transactions table to avoid circular imports
  const result = await db.all<{ count: number }>(
    sql`SELECT COUNT(*) as count FROM transactions WHERE account_id = ${id} OR to_account_id = ${id}`
  );
  return result[0]?.count ?? 0;
}
