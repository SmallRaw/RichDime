import { CategoryPickerFeature } from '@rich-dime/kit/features';
import { useRouter } from 'expo-router';

export default function CategoryPickerModal() {
  const router = useRouter();

  return (
    <CategoryPickerFeature
      type="expense"
      onClose={() => router.back()}
      onSelectCategory={(category) => {
        console.log('Selected category:', category);
        router.back();
      }}
      onTypeChange={(type) => {
        console.log('Type changed:', type);
      }}
      onTransferPress={() => {
        // TODO: handle transfer
      }}
    />
  );
}
