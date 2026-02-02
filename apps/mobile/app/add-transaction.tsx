import { AddTransactionScreen } from '@rich-dime/kit/screens';
import { useRouter } from 'expo-router';

export default function AddTransactionModal() {
  const router = useRouter();

  return (
    <AddTransactionScreen
      onClose={() => router.back()}
      onEditCategories={() => {
        router.push('/edit-categories');
      }}
    />
  );
}
