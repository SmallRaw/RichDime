import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { DateHeader } from './date-header';

const meta = {
  title: 'Bookkeeping/DateHeader',
  component: DateHeader,
  decorators: [
    (Story) => (
      <View style={{ backgroundColor: '#ffffff', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    date: { control: 'text' },
    weekday: { control: 'text' },
    totalAmount: { control: 'text' },
  },
} satisfies Meta<typeof DateHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    date: 'Today',
    weekday: 'Monday',
    totalAmount: '-¥256.00',
    totalAmountClassName: 'text-expense',
  },
};

export const WithIncome: Story = {
  args: {
    date: 'Yesterday',
    weekday: 'Sunday',
    totalAmount: '+¥15,000.00',
    totalAmountClassName: 'text-income',
  },
};

export const SpecificDate: Story = {
  args: {
    date: 'Jan 15',
    weekday: 'Wednesday',
    totalAmount: '-¥1,280.00',
    totalAmountClassName: 'text-expense',
  },
};

export const WithoutWeekday: Story = {
  args: {
    date: 'Jan 15, 2024',
    totalAmount: '-¥500.00',
    totalAmountClassName: 'text-expense',
  },
};

export const WithoutTotal: Story = {
  args: {
    date: 'Today',
    weekday: 'Monday',
  },
};

export const MultipleHeaders: Story = {
  render: () => (
    <View style={{ width: 358 }}>
      <DateHeader
        date="Today"
        weekday="Monday"
        totalAmount="-¥256.00"
        totalAmountClassName="text-expense"
      />
      <DateHeader
        date="Yesterday"
        weekday="Sunday"
        totalAmount="+¥15,000.00"
        totalAmountClassName="text-income"
      />
      <DateHeader
        date="Jan 26"
        weekday="Saturday"
        totalAmount="-¥1,280.00"
        totalAmountClassName="text-expense"
      />
    </View>
  ),
};
