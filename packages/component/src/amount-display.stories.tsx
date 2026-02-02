import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { AmountDisplay } from './amount-display';

const meta = {
  title: 'Bookkeeping/AmountDisplay',
  component: AmountDisplay,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fafafa' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['expense', 'income', 'neutral'],
    },
    size: {
      control: 'select',
      options: ['default', 'lg'],
    },
    currency: { control: 'text' },
    value: { control: 'text' },
    decimal: { control: 'text' },
  },
} satisfies Meta<typeof AmountDisplay>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expense: Story = {
  args: {
    variant: 'expense',
    currency: '¥',
    value: '1,280',
    decimal: '.00',
  },
};

export const Income: Story = {
  args: {
    variant: 'income',
    currency: '¥',
    value: '15,000',
    decimal: '.00',
  },
};

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    currency: '¥',
    value: '5,000',
    decimal: '.00',
  },
};

export const LargeSize: Story = {
  args: {
    variant: 'expense',
    size: 'lg',
    currency: '¥',
    value: '1,280',
    decimal: '.00',
  },
};

export const WithoutDecimal: Story = {
  args: {
    variant: 'expense',
    currency: '¥',
    value: '1,280',
  },
};

export const DollarCurrency: Story = {
  args: {
    variant: 'income',
    currency: '$',
    value: '1,500',
    decimal: '.00',
  },
};

export const AllVariants: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <AmountDisplay variant="expense" currency="¥" value="1,280" decimal=".00" />
      <AmountDisplay variant="income" currency="¥" value="15,000" decimal=".00" />
      <AmountDisplay variant="neutral" currency="¥" value="5,000" decimal=".00" />
    </View>
  ),
};

export const SizeComparison: Story = {
  render: () => (
    <View style={{ gap: 24 }}>
      <AmountDisplay variant="expense" size="default" currency="¥" value="1,280" decimal=".00" />
      <AmountDisplay variant="expense" size="lg" currency="¥" value="1,280" decimal=".00" />
    </View>
  ),
};
