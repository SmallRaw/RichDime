/**
 * 数据库 Provider
 * 在应用启动时异步初始化数据库，不阻塞子组件渲染
 */

import React, { createContext, useContext, type ReactNode } from 'react';
import { useDatabase } from '../hooks/database/use-database';

interface DatabaseContextValue {
  isInitialized: boolean;
  isLoading: boolean;
  error: Error | null;
  reset: () => Promise<void>;
}

const defaultContextValue: DatabaseContextValue = {
  isInitialized: false,
  isLoading: true,
  error: null,
  reset: async () => {},
};

const DatabaseContext = createContext<DatabaseContextValue>(defaultContextValue);

interface DatabaseProviderProps {
  children: ReactNode;
  /** 数据库初始化完成后的回调 */
  onReady?: () => void;
}

/**
 * 数据库 Provider
 * 异步初始化数据库，始终渲染子组件
 */
export function DatabaseProvider({
  children,
  onReady,
}: DatabaseProviderProps) {
  const { isInitialized, isLoading, error, reset } = useDatabase();

  React.useEffect(() => {
    if (isInitialized && onReady) {
      onReady();
    }
  }, [isInitialized, onReady]);

  return (
    <DatabaseContext.Provider value={{ isInitialized, isLoading, error, reset }}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * 使用数据库上下文
 */
export function useDatabaseContext(): DatabaseContextValue {
  return useContext(DatabaseContext);
}

