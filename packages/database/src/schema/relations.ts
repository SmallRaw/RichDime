/**
 * Drizzle ORM 关系定义
 */

import { relations } from 'drizzle-orm';
import { accounts, categories, transactions, recurringTransactions, budgets } from './tables';

// ============ Account 关系 ============

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions, { relationName: 'accountTransactions' }),
  incomingTransfers: many(transactions, { relationName: 'toAccountTransactions' }),
  recurringTransactions: many(recurringTransactions, { relationName: 'accountRecurring' }),
  budgets: many(budgets),
}));

// ============ Category 关系 ============

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'categoryChildren',
  }),
  children: many(categories, { relationName: 'categoryChildren' }),
  transactions: many(transactions),
  recurringTransactions: many(recurringTransactions),
  budgets: many(budgets),
}));

// ============ Transaction 关系 ============

export const transactionsRelations = relations(transactions, ({ one }) => ({
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
    relationName: 'accountTransactions',
  }),
  toAccount: one(accounts, {
    fields: [transactions.toAccountId],
    references: [accounts.id],
    relationName: 'toAccountTransactions',
  }),
  recurring: one(recurringTransactions, {
    fields: [transactions.recurringId],
    references: [recurringTransactions.id],
  }),
}));

// ============ RecurringTransaction 关系 ============

export const recurringTransactionsRelations = relations(recurringTransactions, ({ one, many }) => ({
  category: one(categories, {
    fields: [recurringTransactions.categoryId],
    references: [categories.id],
  }),
  account: one(accounts, {
    fields: [recurringTransactions.accountId],
    references: [accounts.id],
    relationName: 'accountRecurring',
  }),
  toAccount: one(accounts, {
    fields: [recurringTransactions.toAccountId],
    references: [accounts.id],
  }),
  transactions: many(transactions),
}));

// ============ Budget 关系 ============

export const budgetsRelations = relations(budgets, ({ one }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
  account: one(accounts, {
    fields: [budgets.accountId],
    references: [accounts.id],
  }),
}));
