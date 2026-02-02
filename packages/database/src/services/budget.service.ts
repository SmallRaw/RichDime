/**
 * 预算业务服务
 * 预算执行计算、超支告警
 */

import { sql } from 'drizzle-orm';
import { getDrizzle, type DrizzleTransaction } from '../connection';
import { now, startOfMonth, endOfMonth, startOfYear, endOfYear } from '../utils/date';
import { getAllBudgets, getBudgetById } from '../repositories/budget.repository';
import type { BudgetExecution } from '../models/types';

/**
 * 获取预算执行情况
 */
export async function getBudgetExecution(budgetId: string, tx?: DrizzleTransaction): Promise<BudgetExecution | null> {
  const budget = await getBudgetById(budgetId, tx);
  if (!budget) {
    return null;
  }

  const db = tx ?? await getDrizzle();
  const currentTime = now();
  let periodStart: number;
  let periodEnd: number;

  if (budget.frequency === 'monthly') {
    periodStart = startOfMonth(currentTime);
    periodEnd = endOfMonth(currentTime);
  } else {
    periodStart = startOfYear(currentTime);
    periodEnd = endOfYear(currentTime);
  }

  const spentResult = await db.all<{ spent: number }>(sql`
    SELECT COALESCE(SUM(amount), 0) as spent
    FROM transactions
    WHERE type = 'expense'
      AND is_void = 0
      AND date >= ${periodStart}
      AND date <= ${periodEnd}
      ${budget.categoryId ? sql`AND category_id = ${budget.categoryId}` : sql``}
      ${budget.accountId ? sql`AND account_id = ${budget.accountId}` : sql``}
  `);

  const spent = spentResult[0]?.spent ?? 0;
  const remaining = budget.amount - spent;
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
  const daysRemaining = Math.ceil((periodEnd - currentTime) / (24 * 60 * 60 * 1000));

  return {
    budget,
    spent,
    remaining,
    percentage: Math.round(percentage * 100) / 100,
    isOverBudget: spent > budget.amount,
    daysRemaining: Math.max(0, daysRemaining),
  };
}

/**
 * 获取所有活跃预算的执行情况
 */
export async function getAllBudgetExecutions(tx?: DrizzleTransaction): Promise<BudgetExecution[]> {
  const allBudgets = await getAllBudgets(true, tx);
  const executions: BudgetExecution[] = [];

  for (const budget of allBudgets) {
    const execution = await getBudgetExecution(budget.id, tx);
    if (execution) {
      executions.push(execution);
    }
  }

  return executions;
}

/**
 * 获取超预算告警
 */
export async function getOverBudgetAlerts(tx?: DrizzleTransaction): Promise<BudgetExecution[]> {
  const executions = await getAllBudgetExecutions(tx);
  return executions.filter(
    (e) => e.percentage >= e.budget.alertThreshold || e.isOverBudget
  );
}
