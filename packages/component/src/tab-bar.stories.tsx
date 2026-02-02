import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Home, BarChart2, Wallet, Settings } from 'lucide-react-native';
import { TabBar, TabItem } from './tab-bar';

const meta = {
  title: 'Bookkeeping/TabBar',
  component: TabBar,
  decorators: [
    (Story) => (
      <View style={{ width: 358, backgroundColor: '#fafafa' }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TabBar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const HomeActive: Story = {
  render: () => (
    <TabBar>
      <TabItem icon={Home} label="Home" active />
      <TabItem icon={BarChart2} label="Stats" />
      <TabItem icon={Wallet} label="Accounts" />
      <TabItem icon={Settings} label="Settings" />
    </TabBar>
  ),
};

export const StatsActive: Story = {
  render: () => (
    <TabBar>
      <TabItem icon={Home} label="Home" />
      <TabItem icon={BarChart2} label="Stats" active />
      <TabItem icon={Wallet} label="Accounts" />
      <TabItem icon={Settings} label="Settings" />
    </TabBar>
  ),
};

export const AccountsActive: Story = {
  render: () => (
    <TabBar>
      <TabItem icon={Home} label="Home" />
      <TabItem icon={BarChart2} label="Stats" />
      <TabItem icon={Wallet} label="Accounts" active />
      <TabItem icon={Settings} label="Settings" />
    </TabBar>
  ),
};

export const SettingsActive: Story = {
  render: () => (
    <TabBar>
      <TabItem icon={Home} label="Home" />
      <TabItem icon={BarChart2} label="Stats" />
      <TabItem icon={Wallet} label="Accounts" />
      <TabItem icon={Settings} label="Settings" active />
    </TabBar>
  ),
};

export const ThreeTabBar: Story = {
  render: () => (
    <TabBar>
      <TabItem icon={Home} label="Home" active />
      <TabItem icon={BarChart2} label="Stats" />
      <TabItem icon={Settings} label="Settings" />
    </TabBar>
  ),
};
