import { EditCategoriesScreen } from '@rich-dime/kit/screens';
import { useRouter } from 'expo-router';

export default function EditCategoriesModal() {
  const router = useRouter();

  return (
    <EditCategoriesScreen
      onClose={() => router.back()}
      onAddCategory={() => {
        router.push('/add-category');
      }}
      onEditCategory={(category) => {
        router.push({
          pathname: '/edit-category',
          params: {
            id: category.id,
            name: category.name,
            type: category.type,
            icon: category.icon,
            color: category.color,
          },
        });
      }}
    />
  );
}
