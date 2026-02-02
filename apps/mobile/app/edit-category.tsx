import { CategoryFormScreen } from '@rich-dime/kit/screens';
import { useRouter, useLocalSearchParams } from 'expo-router';
import type { Category } from '@rich-dime/database';

export default function EditCategoryModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    name: string;
    type: string;
    icon: string;
    color: string;
  }>();

  // Reconstruct category from route params
  const category: Category = {
    id: params.id ?? '',
    name: params.name ?? '',
    type: (params.type as Category['type']) ?? 'expense',
    icon: params.icon ?? '😀',
    color: params.color ?? '#ec4899',
    parentId: null,
    isSystem: false,
    isArchived: false,
    sortOrder: 0,
    createdAt: 0,
    updatedAt: 0,
  };

  return (
    <CategoryFormScreen
      mode="edit"
      category={category}
      onClose={() => router.back()}
      onSuccess={() => {
        router.back();
      }}
    />
  );
}
