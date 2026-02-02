/**
 * 数据库初始化 Hook
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializeDatabase,
  closeDatabase,
  resetDatabase as dbReset,
  executeAllDueRecurringTransactions,
} from '@rich-dime/database';

interface UseDatabaseResult {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  reset: () => Promise<void>;
}

/**
 * 数据库初始化 Hook
 * 应在应用根组件中使用
 */
export function useDatabase(): UseDatabaseResult {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    // 防止重复初始化
    if (initRef.current) return;
    initRef.current = true;

    const init = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 初始化数据库
        await initializeDatabase();

        // 执行到期的循环记账
        await executeAllDueRecurringTransactions();

        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
        console.error('[useDatabase] Initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();

    // 清理
    return () => {
      closeDatabase().catch(console.error);
    };
  }, []);

  const reset = useCallback(async () => {
    try {
      setIsLoading(true);
      await dbReset();
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to reset database'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    reset,
  };
}
