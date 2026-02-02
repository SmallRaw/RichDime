/**
 * Note 搜索 Hook
 * 根据输入文本搜索历史交易备注，用于 Add Transaction 页面的建议功能
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { getTransactions } from '@rich-dime/database';
import type { Transaction } from '@rich-dime/database';

export interface NoteSuggestion {
  note: string;
  amount: number;
  categoryId: string;
  type: 'expense' | 'income';
}

interface UseNoteSearchResult {
  suggestions: NoteSuggestion[];
  search: (text: string) => void;
  clear: () => void;
}

const DEBOUNCE_MS = 300;

/**
 * 搜索历史交易备注，返回去重后的建议列表
 * - 300ms 防抖
 * - 按 note 去重，只保留最近一笔
 */
export function useNoteSearch(): UseNoteSearchResult {
  const [suggestions, setSuggestions] = useState<NoteSuggestion[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((text: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const trimmed = text.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    timerRef.current = setTimeout(async () => {
      try {
        const result = await getTransactions(
          { searchText: trimmed },
          { page: 1, pageSize: 50 }
        );

        // 按 note 去重，只保留最近一笔（结果已按 date DESC 排序）
        const seen = new Set<string>();
        const deduped: NoteSuggestion[] = [];

        for (const tx of result.data) {
          if (!tx.note || seen.has(tx.note)) continue;
          if (tx.type === 'transfer') continue;
          seen.add(tx.note);
          deduped.push({
            note: tx.note,
            amount: tx.amount,
            categoryId: tx.categoryId,
            type: tx.type as 'expense' | 'income',
          });
        }

        setSuggestions(deduped);
      } catch {
        setSuggestions([]);
      }
    }, DEBOUNCE_MS);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setSuggestions([]);
  }, []);

  return { suggestions, search, clear };
}
