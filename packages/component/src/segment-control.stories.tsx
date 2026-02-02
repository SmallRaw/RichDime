import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { useState } from 'react';
import { SegmentControl } from './segment-control';

const meta = {
  title: 'Bookkeeping/SegmentControl',
  component: SegmentControl,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#fafafa', alignItems: 'flex-start' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SegmentControl>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ExpenseIncome: Story = {
  render: () => {
    const ControlledSegment = () => {
      const [value, setValue] = useState('expense');
      return (
        <SegmentControl
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    return <ControlledSegment />;
  },
};

export const ThreeOptions: Story = {
  render: () => {
    const ControlledSegment = () => {
      const [value, setValue] = useState('expense');
      return (
        <SegmentControl
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
            { value: 'transfer', label: 'Transfer' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    return <ControlledSegment />;
  },
};

export const TimeFilter: Story = {
  render: () => {
    const ControlledSegment = () => {
      const [value, setValue] = useState('week');
      return (
        <SegmentControl
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    return <ControlledSegment />;
  },
};

export const ExpenseSelected: Story = {
  args: {
    options: [
      { value: 'expense', label: 'Expense' },
      { value: 'income', label: 'Income' },
    ],
    value: 'expense',
    onValueChange: () => {},
  },
};

export const IncomeSelected: Story = {
  args: {
    options: [
      { value: 'expense', label: 'Expense' },
      { value: 'income', label: 'Income' },
    ],
    value: 'income',
    onValueChange: () => {},
  },
};
