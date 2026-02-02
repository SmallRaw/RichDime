export const queryKeys = {
  categories: {
    all: ['categories'] as const,
    byType: (type: string) => ['categories', 'byType', type] as const,
  },
  accounts: {
    all: ['accounts'] as const,
    detail: (id: string) => ['accounts', id] as const,
  },
  transactions: {
    all: ['transactions'] as const,
    list: (filter: Record<string, unknown>) => ['transactions', 'list', filter] as const,
    detail: (id: string) => ['transactions', id] as const,
  },
  budgets: {
    all: ['budgets'] as const,
    execution: (id: string) => ['budgets', 'execution', id] as const,
  },
  recurring: {
    all: ['recurring'] as const,
    detail: (id: string) => ['recurring', id] as const,
  },
  statistics: {
    all: ['statistics'] as const,
    summary: (key: string, dateRange?: object) => ['statistics', 'summary', key, dateRange] as const,
    categoryStats: (type: string, dateRange?: object) => ['statistics', 'category', type, dateRange] as const,
    trend: (months: number) => ['statistics', 'trend', months] as const,
    balanceChanges: (dateRange: object) => ['statistics', 'balanceChanges', dateRange] as const,
    expenseRanking: (topN: number, dateRange?: object) => ['statistics', 'expenseRanking', topN, dateRange] as const,
    incomeRanking: (topN: number, dateRange?: object) => ['statistics', 'incomeRanking', topN, dateRange] as const,
  },
};
