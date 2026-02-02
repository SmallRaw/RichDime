/**
 * 分类 Repository
 * 纯数据访问层 — Drizzle ORM 重写
 */

import { eq, and, asc, isNull, sql } from 'drizzle-orm';
import { getDrizzle, generateId, type DrizzleTransaction } from '../connection';
import { now } from '../utils/date';
import { categories } from '../schema/tables';
import type {
  Category,
  TransactionType,
  CreateCategoryDTO,
  UpdateCategoryDTO,
} from '../models/types';

type CategoryRow = typeof categories.$inferSelect;

/** 将 Drizzle 行转换为 Category 实体 */
function rowToCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    parentId: row.parentId,
    isSystem: row.isSystem,
    isArchived: row.isArchived,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * 获取所有分类
 */
export async function getAllCategories(includeArchived: boolean = false, tx?: DrizzleTransaction): Promise<Category[]> {
  const db = tx ?? await getDrizzle();

  const rows = includeArchived
    ? await db.select().from(categories).orderBy(asc(categories.type), asc(categories.sortOrder), asc(categories.createdAt))
    : await db.select().from(categories)
        .where(eq(categories.isArchived, false))
        .orderBy(asc(categories.type), asc(categories.sortOrder), asc(categories.createdAt));

  return rows.map(rowToCategory);
}

/**
 * 根据类型获取分类
 */
export async function getCategoriesByType(
  type: TransactionType,
  includeArchived: boolean = false,
  tx?: DrizzleTransaction
): Promise<Category[]> {
  const db = tx ?? await getDrizzle();

  const conditions = includeArchived
    ? eq(categories.type, type)
    : and(eq(categories.type, type), eq(categories.isArchived, false));

  const rows = await db.select().from(categories)
    .where(conditions)
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  return rows.map(rowToCategory);
}

/**
 * 获取顶级分类（无父分类）
 */
export async function getTopLevelCategories(type?: TransactionType, tx?: DrizzleTransaction): Promise<Category[]> {
  const db = tx ?? await getDrizzle();

  const conditions = type
    ? and(isNull(categories.parentId), eq(categories.isArchived, false), eq(categories.type, type))
    : and(isNull(categories.parentId), eq(categories.isArchived, false));

  const rows = await db.select().from(categories)
    .where(conditions)
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  return rows.map(rowToCategory);
}

/**
 * 获取子分类
 */
export async function getChildCategories(parentId: string, tx?: DrizzleTransaction): Promise<Category[]> {
  const db = tx ?? await getDrizzle();

  const rows = await db.select().from(categories)
    .where(and(eq(categories.parentId, parentId), eq(categories.isArchived, false)))
    .orderBy(asc(categories.sortOrder), asc(categories.createdAt));

  return rows.map(rowToCategory);
}

/**
 * 根据 ID 获取分类
 */
export async function getCategoryById(id: string, tx?: DrizzleTransaction): Promise<Category | null> {
  const db = tx ?? await getDrizzle();
  const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return rows.length > 0 ? rowToCategory(rows[0]) : null;
}

/**
 * 创建分类
 */
export async function createCategory(dto: CreateCategoryDTO, tx?: DrizzleTransaction): Promise<Category> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();
  const id = generateId();

  await db.insert(categories).values({
    id,
    name: dto.name,
    type: dto.type,
    icon: dto.icon ?? 'folder',
    color: dto.color ?? '#6366f1',
    parentId: dto.parentId ?? null,
    isSystem: false,
    isArchived: false,
    sortOrder: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const category = await getCategoryById(id, tx);
  if (!category) {
    throw new Error('Failed to create category');
  }
  return category;
}

/**
 * 更新分类（纯数据操作）
 */
export async function updateCategory(id: string, dto: UpdateCategoryDTO, tx?: DrizzleTransaction): Promise<Category> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  const updates: Partial<typeof categories.$inferInsert> = { updatedAt: timestamp };

  if (dto.name !== undefined) updates.name = dto.name;
  if (dto.icon !== undefined) updates.icon = dto.icon;
  if (dto.color !== undefined) updates.color = dto.color;
  if (dto.parentId !== undefined) updates.parentId = dto.parentId ?? null;
  if (dto.isArchived !== undefined) updates.isArchived = dto.isArchived;
  if (dto.sortOrder !== undefined) updates.sortOrder = dto.sortOrder;

  await db.update(categories).set(updates).where(eq(categories.id, id));

  const category = await getCategoryById(id, tx);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
}

/**
 * 删除分类（纯数据操作）
 */
export async function deleteCategoryRow(id: string, tx?: DrizzleTransaction): Promise<void> {
  const db = tx ?? await getDrizzle();
  await db.delete(categories).where(eq(categories.id, id));
}

/**
 * 批量更新分类排序
 */
export async function updateCategorySortOrder(
  orders: Array<{ id: string; sortOrder: number }>,
  tx?: DrizzleTransaction
): Promise<void> {
  const db = tx ?? await getDrizzle();
  const timestamp = now();

  for (const { id, sortOrder } of orders) {
    await db.update(categories).set({
      sortOrder,
      updatedAt: timestamp,
    }).where(eq(categories.id, id));
  }
}

/**
 * 获取分类及其所有子分类 ID（递归）
 */
export async function getCategoryWithChildrenIds(categoryId: string, tx?: DrizzleTransaction): Promise<string[]> {
  const db = tx ?? await getDrizzle();
  const ids = [categoryId];

  async function getChildIds(parentId: string): Promise<void> {
    const children = await db.select({ id: categories.id })
      .from(categories)
      .where(eq(categories.parentId, parentId));

    for (const child of children) {
      ids.push(child.id);
      await getChildIds(child.id);
    }
  }

  await getChildIds(categoryId);
  return ids;
}

/**
 * 获取分类关联的交易数量
 */
export async function getCategoryTransactionCount(id: string, tx?: DrizzleTransaction): Promise<number> {
  const db = tx ?? await getDrizzle();
  const result = await db.all<{ count: number }>(
    sql`SELECT COUNT(*) as count FROM transactions WHERE category_id = ${id}`
  );
  return result[0]?.count ?? 0;
}

/**
 * 获取分类的子分类数量
 */
export async function getCategoryChildCount(id: string, tx?: DrizzleTransaction): Promise<number> {
  const db = tx ?? await getDrizzle();
  const result = await db.select({ count: sql<number>`COUNT(*)` })
    .from(categories)
    .where(eq(categories.parentId, id));
  return result[0]?.count ?? 0;
}
