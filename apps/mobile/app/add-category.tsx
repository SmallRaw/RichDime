import { CategoryFormScreen } from '@rich-dime/kit/screens';
import { useRouter } from 'expo-router';

export default function AddCategoryModal() {
  const router = useRouter();

  return (
    <CategoryFormScreen
      mode="add"
      onClose={() => router.back()}
      onSuccess={() => {
        router.back();
      }}
    />
  );
}
