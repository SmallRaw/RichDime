import { useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';

/**
 * React Navigation 屏幕聚焦时 invalidate 指定的 query keys
 * 跳过首次 mount（数据已由 useQuery 自动加载）
 */
export function useRefetchOnFocus(keys?: readonly (readonly unknown[])[]) {
  const queryClient = useQueryClient();
  const isFirstFocusRef = useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocusRef.current) {
        isFirstFocusRef.current = false;
        return;
      }
      if (keys) {
        for (const key of keys) {
          queryClient.invalidateQueries({ queryKey: key as unknown[] });
        }
      } else {
        queryClient.invalidateQueries();
      }
    }, [queryClient, keys])
  );
}
