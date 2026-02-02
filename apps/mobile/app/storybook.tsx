import { useState, useCallback } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Text,
  Icon,
  Button,
  Input,
  Checkbox,
  Switch,
  Avatar,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  TransactionItem,
  DateHeader,
  StatsCard,
  FAB,
  TabBar,
  TabItem,
  CategoryItem,
  CategoryChip,
  CategoryListItem,
  CategorySuggestedItem,
  AmountDisplay,
  EmptyState,
  SegmentControl,
  SectionTitle,
  Numpad,
  SummarySection,
  ScreenHeader,
  LoadingState,
  ErrorState,
  useThemeColors,
} from '@rich-dime/component';
import {
  ChevronLeft,
  Utensils,
  Briefcase,
  ShoppingCart,
  Car,
  Home,
  Gamepad2,
  Heart,
  Wallet,
  Receipt,
  TrendingUp,
  BarChart3,
  Settings,
  Plus,
} from 'lucide-react-native';

// Section wrapper component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={{ marginBottom: 32 }}>
      <Text
        style={{
          fontSize: 18,
          fontFamily: 'NotoSansSC_600SemiBold',
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
        color={colors.foreground}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

// Component showcase item
function ShowcaseItem({ label, children }: { label?: string; children: React.ReactNode }) {
  const colors = useThemeColors();
  return (
    <View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
      {label && (
        <Text
          variant="caption"
          style={{ marginBottom: 8 }}
          color={colors.mutedForeground}
        >
          {label}
        </Text>
      )}
      {children}
    </View>
  );
}

export default function StorybookScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  // State for interactive components
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [segmentValue, setSegmentValue] = useState('expense');
  const [inputValue, setInputValue] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
          paddingHorizontal: 16,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          marginTop: insets.top,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ padding: 8, marginLeft: -8 }}>
          <Icon as={ChevronLeft} size={24} color={colors.foreground} />
        </Pressable>
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'NotoSansSC_600SemiBold',
            marginLeft: 8,
          }}
          color={colors.foreground}
        >
          组件库
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 24, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Typography ===== */}
        <Section title="Typography 文字排版">
          <ShowcaseItem label="title">
            <Text variant="title">标题文字 Title</Text>
          </ShowcaseItem>
          <ShowcaseItem label="subtitle">
            <Text variant="subtitle">副标题 Subtitle</Text>
          </ShowcaseItem>
          <ShowcaseItem label="body">
            <Text variant="body">正文文字 Body text for paragraphs</Text>
          </ShowcaseItem>
          <ShowcaseItem label="label">
            <Text variant="label">标签文字 Label</Text>
          </ShowcaseItem>
          <ShowcaseItem label="caption">
            <Text variant="caption">说明文字 Caption text</Text>
          </ShowcaseItem>
          <ShowcaseItem label="overline">
            <Text variant="overline">SECTION TITLE</Text>
          </ShowcaseItem>
          <ShowcaseItem label="amount">
            <Text variant="amount">¥1,280.00</Text>
          </ShowcaseItem>
          <ShowcaseItem label="amountLg">
            <Text variant="amountLg">¥15,000</Text>
          </ShowcaseItem>
        </Section>

        {/* ===== Buttons ===== */}
        <Section title="Button 按钮">
          <ShowcaseItem label="default">
            <Button>
              <Text>Default Button</Text>
            </Button>
          </ShowcaseItem>
          <ShowcaseItem label="secondary">
            <Button variant="secondary">
              <Text>Secondary</Text>
            </Button>
          </ShowcaseItem>
          <ShowcaseItem label="outline">
            <Button variant="outline">
              <Text>Outline</Text>
            </Button>
          </ShowcaseItem>
          <ShowcaseItem label="ghost">
            <Button variant="ghost">
              <Text>Ghost</Text>
            </Button>
          </ShowcaseItem>
          <ShowcaseItem label="destructive">
            <Button variant="destructive">
              <Text>Destructive</Text>
            </Button>
          </ShowcaseItem>
          <ShowcaseItem label="disabled">
            <Button disabled>
              <Text>Disabled</Text>
            </Button>
          </ShowcaseItem>
        </Section>

        {/* ===== Form Controls ===== */}
        <Section title="Form 表单控件">
          <ShowcaseItem label="Input">
            <Input
              placeholder="请输入内容..."
              value={inputValue}
              onChangeText={setInputValue}
            />
          </ShowcaseItem>
          <ShowcaseItem label="Checkbox">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Checkbox
                checked={checkboxChecked}
                onCheckedChange={setCheckboxChecked}
              />
              <Text variant="body">同意用户协议</Text>
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="Switch">
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text variant="body">启用通知</Text>
              <Switch
                checked={switchEnabled}
                onCheckedChange={setSwitchEnabled}
              />
            </View>
          </ShowcaseItem>
        </Section>

        {/* ===== Data Display ===== */}
        <Section title="Data Display 数据展示">
          <ShowcaseItem label="Avatar">
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <Avatar size="sm" fallback="S" />
              <Avatar size="md" fallback="M" />
              <Avatar size="lg" fallback="L" />
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="Badge">
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Badge variant="default"><Text>Default</Text></Badge>
              <Badge variant="secondary"><Text>Secondary</Text></Badge>
              <Badge variant="outline"><Text>Outline</Text></Badge>
              <Badge variant="destructive"><Text>Destructive</Text></Badge>
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="Card">
            <Card>
              <CardHeader>
                <CardTitle>卡片标题</CardTitle>
                <CardDescription>这是卡片的描述文字</CardDescription>
              </CardHeader>
              <CardContent>
                <Text variant="body">卡片内容区域</Text>
              </CardContent>
            </Card>
          </ShowcaseItem>
        </Section>

        {/* ===== Amount Display ===== */}
        <Section title="Amount Display 金额展示">
          <ShowcaseItem label="expense">
            <AmountDisplay variant="expense" value="1,280" decimal=".00" />
          </ShowcaseItem>
          <ShowcaseItem label="income">
            <AmountDisplay variant="income" value="15,000" decimal=".00" />
          </ShowcaseItem>
          <ShowcaseItem label="neutral">
            <AmountDisplay variant="neutral" value="7,440" decimal=".00" />
          </ShowcaseItem>
          <ShowcaseItem label="large size">
            <AmountDisplay size="lg" value="25,680" decimal=".00" />
          </ShowcaseItem>
        </Section>

        {/* ===== Summary Section ===== */}
        <Section title="Summary Section 汇总区">
          <ShowcaseItem>
            <SummarySection
              period="this month"
              totalAmount="7,513.87"
              currencySymbol="¥"
              totalLabel="Spent"
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Stats Card ===== */}
        <Section title="Stats Card 统计卡片">
          <ShowcaseItem>
            <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 0 }}>
              <View style={{ flex: 1 }}>
                <StatsCard
                  variant="income"
                  label="Income"
                  amount="¥15,680.00"
                  change="+12.5% vs last month"
                />
              </View>
              <View style={{ flex: 1 }}>
                <StatsCard
                  variant="expense"
                  label="Expense"
                  amount="¥8,240.00"
                  change="-5.2% vs last month"
                />
              </View>
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="balance">
            <StatsCard
              variant="balance"
              label="Balance"
              amount="¥7,440.00"
              change="This month"
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Transaction Item ===== */}
        <Section title="Transaction Item 交易记录">
          <ShowcaseItem label="expense">
            <TransactionItem
              icon={Utensils}
              categoryName="餐饮"
              note="和朋友聚餐"
              amount="-¥128.00"
              account="支付宝"
              variant="expense"
            />
          </ShowcaseItem>
          <ShowcaseItem label="income">
            <TransactionItem
              icon={Briefcase}
              categoryName="工资"
              note="月薪"
              amount="+¥15,000.00"
              account="银行卡"
              variant="income"
            />
          </ShowcaseItem>
          <ShowcaseItem label="transfer">
            <TransactionItem
              icon={Wallet}
              categoryName="转账"
              note="转入储蓄"
              amount="¥5,000.00"
              account="银行 → 储蓄"
              variant="transfer"
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Date Header ===== */}
        <Section title="Date Header 日期分组">
          <ShowcaseItem>
            <DateHeader date="Today" weekday="Monday" totalAmount="-¥256.00" />
          </ShowcaseItem>
          <ShowcaseItem>
            <DateHeader date="2月1日" weekday="周六" totalAmount="-¥1,024.00" />
          </ShowcaseItem>
        </Section>

        {/* ===== Segment Control ===== */}
        <Section title="Segment Control 分段控制">
          <ShowcaseItem>
            <SegmentControl
              options={[
                { value: 'expense', label: '支出' },
                { value: 'income', label: '收入' },
              ]}
              value={segmentValue}
              onValueChange={setSegmentValue}
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Section Title ===== */}
        <Section title="Section Title 分区标题">
          <ShowcaseItem>
            <SectionTitle title="EXPENSE CATEGORIES" />
          </ShowcaseItem>
        </Section>

        {/* ===== Category Components ===== */}
        <Section title="Category 分类组件">
          <ShowcaseItem label="CategoryItem">
            <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
              <CategoryItem icon={Utensils} label="餐饮" />
              <CategoryItem icon={ShoppingCart} label="购物" selected />
              <CategoryItem icon={Car} label="交通" />
              <CategoryItem icon={Home} label="居家" />
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="CategoryChip">
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <CategoryChip icon={Gamepad2} label="休闲娱乐" />
              <CategoryChip icon={Car} label="交通出行" selected />
              <CategoryChip icon={Heart} label="医疗健康" />
            </View>
          </ShowcaseItem>
          <ShowcaseItem label="CategoryListItem">
            <CategoryListItem emoji="🍽️" name="餐饮" color="#ef4444" />
            <CategoryListItem emoji="🛒" name="购物" color="#3b82f6" />
            <CategoryListItem emoji="🚗" name="交通" color="#22c55e" showDragHandle />
          </ShowcaseItem>
          <ShowcaseItem label="CategorySuggestedItem">
            <CategorySuggestedItem name="旅行" onAdd={() => {}} />
            <CategorySuggestedItem name="教育" onAdd={() => {}} />
          </ShowcaseItem>
        </Section>

        {/* ===== FAB ===== */}
        <Section title="FAB 浮动按钮">
          <ShowcaseItem>
            <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
              <FAB icon={Plus} />
              <FAB icon={Plus} size="sm" />
              <FAB icon={Plus} variant="secondary" />
            </View>
          </ShowcaseItem>
        </Section>

        {/* ===== Tab Bar ===== */}
        <Section title="Tab Bar 标签栏">
          <ShowcaseItem>
            <TabBar>
              <TabItem icon={Receipt} label="流水" active />
              <TabItem icon={BarChart3} label="统计" />
              <TabItem icon={Settings} label="设置" />
            </TabBar>
          </ShowcaseItem>
        </Section>

        {/* ===== Screen Header ===== */}
        <Section title="Screen Header 页面头部">
          <ShowcaseItem label="with title">
            <ScreenHeader title="编辑分类" />
          </ShowcaseItem>
          <ShowcaseItem label="with left and right">
            <ScreenHeader
              left={
                <Pressable style={{ padding: 8 }}>
                  <Icon as={ChevronLeft} size={24} color={colors.foreground} />
                </Pressable>
              }
              center={<Text variant="subtitle">页面标题</Text>}
              right={
                <Button variant="ghost" size="sm">
                  <Text>保存</Text>
                </Button>
              }
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Empty State ===== */}
        <Section title="Empty State 空状态">
          <ShowcaseItem>
            <EmptyState
              icon={Receipt}
              title="暂无交易记录"
              description="点击下方按钮添加第一笔账单"
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Loading State ===== */}
        <Section title="Loading State 加载状态">
          <ShowcaseItem>
            <LoadingState message="加载中..." />
          </ShowcaseItem>
        </Section>

        {/* ===== Error State ===== */}
        <Section title="Error State 错误状态">
          <ShowcaseItem>
            <ErrorState
              message="加载失败，请重试"
              onRetry={() => {}}
            />
          </ShowcaseItem>
        </Section>

        {/* ===== Numpad ===== */}
        <Section title="Numpad 数字键盘">
          <ShowcaseItem label="with operators">
            <Numpad
              onKeyPress={(key) => console.log('Key:', key)}
              onDelete={() => console.log('Delete')}
              onConfirm={() => console.log('Confirm')}
              showOperators={true}
            />
          </ShowcaseItem>
          <ShowcaseItem label="without operators">
            <Numpad
              onKeyPress={(key) => console.log('Key:', key)}
              onDelete={() => console.log('Delete')}
              onConfirm={() => console.log('Confirm')}
              showOperators={false}
            />
          </ShowcaseItem>
        </Section>

      </ScrollView>
    </View>
  );
}
