import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { CategorySuggestedItem } from './category-suggested-item';

const action = (name: string) => () => console.log(name);

const meta = {
  title: 'Bookkeeping/CategorySuggestedItem',
  component: CategorySuggestedItem,
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#ffffff', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    name: { control: 'text' },
  },
} satisfies Meta<typeof CategorySuggestedItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Transport',
    onAdd: action('onAdd'),
  },
};

export const ChineseName: Story = {
  args: {
    name: '交通出行',
    onAdd: action('onAdd'),
  },
};

export const MultipleSuggestions: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <CategorySuggestedItem name="Transport" onAdd={action('onAdd-transport')} />
      <CategorySuggestedItem name="Healthcare" onAdd={action('onAdd-healthcare')} />
      <CategorySuggestedItem name="Education" onAdd={action('onAdd-education')} />
      <CategorySuggestedItem name="Fitness" onAdd={action('onAdd-fitness')} />
      <CategorySuggestedItem name="Travel" onAdd={action('onAdd-travel')} />
    </View>
  ),
};

export const ChineseSuggestions: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <CategorySuggestedItem name="交通出行" onAdd={action('onAdd')} />
      <CategorySuggestedItem name="医疗健康" onAdd={action('onAdd')} />
      <CategorySuggestedItem name="教育培训" onAdd={action('onAdd')} />
      <CategorySuggestedItem name="运动健身" onAdd={action('onAdd')} />
      <CategorySuggestedItem name="旅游度假" onAdd={action('onAdd')} />
    </View>
  ),
};
