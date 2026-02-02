import { StatisticsScreen } from '@rich-dime/kit/screens';
import { useRouter } from 'expo-router';

export default function StatisticsTab() {
  const router = useRouter();

  return (
    <StatisticsScreen
      onCategoryPress={(categoryId) => {
        // TODO: navigate to category detail
      }}
      onTransactionPress={(transactionId) => {
        // TODO: navigate to transaction detail
      }}
      onViewAllTransactions={() => {
        router.push('/(tabs)');
      }}
    />
  );
}
