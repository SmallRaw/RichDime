import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Numpad } from './numpad';

const action = (name: string) => () => console.log(name);

const meta = {
  title: 'Bookkeeping/Numpad',
  component: Numpad,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: '#f5f5f5', width: 358 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    showOperators: { control: 'boolean' },
  },
} satisfies Meta<typeof Numpad>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithOperators: Story = {
  args: {
    showOperators: true,
    onKeyPress: action('onKeyPress'),
    onDelete: action('onDelete'),
    onConfirm: action('onConfirm'),
  },
};

export const WithoutOperators: Story = {
  args: {
    showOperators: false,
    onKeyPress: action('onKeyPress'),
    onDelete: action('onDelete'),
    onConfirm: action('onConfirm'),
  },
};

export const Default: Story = {
  args: {
    onKeyPress: action('onKeyPress'),
    onDelete: action('onDelete'),
    onConfirm: action('onConfirm'),
  },
};

export const FullWidth: Story = {
  render: () => (
    <View style={{ width: '100%' }}>
      <Numpad
        showOperators={true}
        onKeyPress={action('onKeyPress')}
        onDelete={action('onDelete')}
        onConfirm={action('onConfirm')}
      />
    </View>
  ),
};

export const Comparison: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ flex: 1 }}>
        <Numpad
          showOperators={true}
          onKeyPress={action('onKeyPress')}
          onDelete={action('onDelete')}
          onConfirm={action('onConfirm')}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Numpad
          showOperators={false}
          onKeyPress={action('onKeyPress')}
          onDelete={action('onDelete')}
          onConfirm={action('onConfirm')}
        />
      </View>
    </View>
  ),
};
