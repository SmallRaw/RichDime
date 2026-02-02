/**
 * 分类业务服务
 * 处理系统分类保护、删除前校验等业务逻辑
 */

import {
  getCategoryById,
  updateCategory as updateCategoryRepo,
  deleteCategoryRow,
  getCategoryTransactionCount,
  getCategoryChildCount,
} from '../repositories/category.repository';
import type { UpdateCategoryDTO } from '../models/types';

/**
 * 安全更新分类（系统分类不可改 parentId）
 */
export async function updateCategorySafe(id: string, dto: UpdateCategoryDTO) {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new Error('Category not found');
  }

  if (existing.isSystem && dto.parentId !== undefined) {
    throw new Error('Cannot change parent of system category');
  }

  return updateCategoryRepo(id, dto);
}

/**
 * 安全删除分类
 * - 系统分类不可删除
 * - 有关联交易不可删除
 * - 有子分类不可删除
 */
export async function deleteCategory(id: string): Promise<void> {
  const category = await getCategoryById(id);
  if (category?.isSystem) {
    throw new Error('Cannot delete system category. Archive it instead.');
  }

  const transactionCount = await getCategoryTransactionCount(id);
  if (transactionCount > 0) {
    throw new Error('Cannot delete category with existing transactions. Archive it instead.');
  }

  const childCount = await getCategoryChildCount(id);
  if (childCount > 0) {
    throw new Error('Cannot delete category with child categories. Delete children first.');
  }

  await deleteCategoryRow(id);
}
