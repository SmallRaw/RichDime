/**
 * Zustand store — 记账流程草稿状态
 *
 * 管理 add-transaction 屏幕的全部业务状态和动作，
 * 组件只负责 UI 渲染和事件绑定。
 */

import { create } from 'zustand';
import type { TransactionType } from '@rich-dime/database';
import type { LoopValue, LoopUnit } from '@rich-dime/component';

// ============ Types ============

interface Recurrence {
  type: LoopValue;
  interval?: number;
  unit?: LoopUnit;
}

interface TransactionDraftState {
  // 核心字段
  type: TransactionType;
  amount: string;
  categoryId: string | undefined;
  accountId: string | undefined;
  toAccountId: string | undefined;
  note: string;
  date: Date;
  recurrence: Recurrence;

  // UI 状态
  isEditingNote: boolean;
  showCategoryPopover: boolean;
  showDatePicker: boolean;
  showLoopPopover: boolean;
  showCustomLoop: boolean;
  showAccountPicker: 'source' | 'target' | null;
  noteInputWidth: number;
}

interface TransactionDraftActions {
  // 核心字段操作
  setType: (type: TransactionType) => void;
  setCategoryId: (id: string | undefined) => void;
  setAccountId: (id: string | undefined) => void;
  setToAccountId: (id: string | undefined) => void;
  setNote: (note: string) => void;
  setDate: (date: Date) => void;

  // 金额操作
  appendDigit: (key: string) => void;
  deleteLastChar: () => void;

  // 循环操作
  setRecurrence: (recurrence: Recurrence) => void;

  // UI 操作
  setIsEditingNote: (editing: boolean) => void;
  setShowCategoryPopover: (show: boolean) => void;
  setShowDatePicker: (show: boolean) => void;
  setShowLoopPopover: (show: boolean) => void;
  setShowCustomLoop: (show: boolean) => void;
  setShowAccountPicker: (picker: 'source' | 'target' | null) => void;
  setNoteInputWidth: (width: number) => void;

  // 业务流程
  /** 切换交易类型，自动重置分类 */
  switchType: (
    newType: TransactionType,
    expenseCategories: { id: string }[],
    incomeCategories: { id: string }[],
  ) => void;

  /** 选中一条智能建议，一次性填入 note + amount + category + type */
  applySuggestion: (suggestion: {
    note: string;
    amount: number;
    categoryId: string;
    type: 'expense' | 'income';
  }) => void;

  /** 选择账户（区分来源/目标） */
  selectAccount: (selectedId: string) => void;

  /** 提交成功后重置草稿 */
  resetDraft: () => void;

  /** 初始化（每次打开页面调用） */
  init: (params?: { categoryId?: string; accountId?: string }) => void;
}

type TransactionDraftStore = TransactionDraftState & TransactionDraftActions;

// ============ Constants ============

const TRANSFER_CATEGORY_ID = 'cat_transfer';

const INITIAL_STATE: TransactionDraftState = {
  type: 'expense',
  amount: '0',
  categoryId: undefined,
  accountId: undefined,
  toAccountId: undefined,
  note: '',
  date: new Date(),
  recurrence: { type: 'none' },
  isEditingNote: false,
  showCategoryPopover: false,
  showDatePicker: false,
  showLoopPopover: false,
  showCustomLoop: false,
  showAccountPicker: null,
  noteInputWidth: 62,
};

// ============ Store ============

export const useTransactionDraft = create<TransactionDraftStore>((set, get) => ({
  ...INITIAL_STATE,

  // ---- 核心字段操作 ----

  setType: (type) => set({ type }),
  setCategoryId: (categoryId) => set({ categoryId }),
  setAccountId: (accountId) => set({ accountId }),
  setToAccountId: (toAccountId) => set({ toAccountId }),
  setNote: (note) => set({ note }),
  setDate: (date) => set({ date }),

  // ---- 金额操作 ----

  appendDigit: (key) => {
    const current = get().amount;

    // Ignore operators
    if (['+', '−', '×', '÷'].includes(key)) return;
    // 10-digit limit
    if (key !== '.' && current.length >= 10) return;

    let next: string;
    if (key === '.') {
      if (current.includes('.')) return;
      if (current.length >= 10) return;
      next = current + '.';
    } else if (current === '0') {
      next = key;
    } else {
      const parts = current.split('.');
      if (parts.length === 2 && parts[1].length >= 2) return;
      next = current + key;
    }

    set({ amount: next });
  },

  deleteLastChar: () => {
    const current = get().amount;
    set({ amount: current.length > 1 ? current.slice(0, -1) : '0' });
  },

  // ---- 循环操作 ----

  setRecurrence: (recurrence) => set({ recurrence }),

  // ---- UI 操作 ----

  setIsEditingNote: (isEditingNote) => set({ isEditingNote }),
  setShowCategoryPopover: (showCategoryPopover) => set({ showCategoryPopover }),
  setShowDatePicker: (showDatePicker) => set({ showDatePicker }),
  setShowLoopPopover: (showLoopPopover) => set({ showLoopPopover }),
  setShowCustomLoop: (showCustomLoop) => set({ showCustomLoop }),
  setShowAccountPicker: (showAccountPicker) => set({ showAccountPicker }),
  setNoteInputWidth: (noteInputWidth) => set({ noteInputWidth }),

  // ---- 业务流程 ----

  switchType: (newType, expenseCategories, incomeCategories) => {
    if (newType === 'transfer') {
      set({
        type: newType,
        categoryId: TRANSFER_CATEGORY_ID,
        toAccountId: undefined,
      });
    } else {
      const cats = newType === 'expense' ? expenseCategories : incomeCategories;
      set({
        type: newType,
        categoryId: cats.length > 0 ? cats[0].id : undefined,
        toAccountId: undefined,
      });
    }
  },

  applySuggestion: (suggestion) => {
    const displayAmount = (suggestion.amount / 100).toString();
    set({
      note: suggestion.note,
      amount: displayAmount,
      categoryId: suggestion.categoryId,
      type: suggestion.type,
      isEditingNote: false,
    });
  },

  selectAccount: (selectedId) => {
    const { showAccountPicker, toAccountId } = get();
    if (showAccountPicker === 'source') {
      const updates: Partial<TransactionDraftState> = {
        accountId: selectedId,
        showAccountPicker: null,
      };
      // 如果目标与新来源相同，清除目标
      if (toAccountId === selectedId) {
        updates.toAccountId = undefined;
      }
      set(updates);
    } else if (showAccountPicker === 'target') {
      set({ toAccountId: selectedId, showAccountPicker: null });
    }
  },

  resetDraft: () => {
    set({
      amount: '0',
      note: '',
      isEditingNote: false,
      toAccountId: undefined,
      recurrence: { type: 'none' },
      date: new Date(),
    });
  },

  init: (params) => {
    set({
      ...INITIAL_STATE,
      date: new Date(),
      categoryId: params?.categoryId,
      accountId: params?.accountId,
    });
  },
}));
