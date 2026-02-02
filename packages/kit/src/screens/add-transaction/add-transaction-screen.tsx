import { useRef, useCallback, useMemo, useEffect } from 'react';
import { View, Pressable, Alert, ActivityIndicator, TextInput, ScrollView, Modal, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/shallow';
import { useRefetchOnFocus } from '../../hooks/use-refetch-on-focus';
import { queryKeys } from '../../hooks/database/query-keys';
import {
  Icon,
  Text,
  SegmentControl,
  Numpad,
  CategoryPopover,
  DateTimePicker,
  LoopPopover,
  CustomLoopDialog,
} from '@rich-dime/component';
import type { CategoryPopoverItem, LoopValue, LoopUnit } from '@rich-dime/component';
import {
  X,
  RefreshCw,
  Menu,
  Calendar,
  Grid2x2,
  Delete,
  ArrowRightLeft,
  Wallet,
} from 'lucide-react-native';
import { useAddTransaction, useCategories, useAccounts, useNoteSearch } from '../../hooks/database';
import { useShakeAnimation } from '../../hooks/use-shake-animation';
import { useThemeColors } from '@rich-dime/component';
import type { TransactionType } from '@rich-dime/database';
import { useTransactionDraft } from '../../store/transaction-draft';

const TRANSACTION_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
  { value: 'transfer', label: 'Transfer' },
];

const TRANSFER_CATEGORY_ID = 'cat_transfer';

// Category emoji mappings
const CATEGORY_EMOJIS: Record<string, string> = {
  dining: '\u{1F37D}\u{FE0F}',
  food: '\u{1F37D}\u{FE0F}',
  餐饮: '\u{1F37D}\u{FE0F}',
  coffee: '\u{2615}',
  咖啡: '\u{2615}',
  shopping: '\u{1F6D2}',
  购物: '\u{1F6D2}',
  transport: '\u{1F684}',
  交通: '\u{1F684}',
  housing: '\u{1F3E0}',
  住房: '\u{1F3E0}',
  居家: '\u{1F3E0}',
  clothing: '\u{1F454}',
  服饰: '\u{1F454}',
  health: '\u{2764}\u{FE0F}',
  医疗: '\u{2764}\u{FE0F}',
  entertainment: '\u{1F3AE}',
  娱乐: '\u{1F3AE}',
  gift: '\u{1F381}',
  礼物: '\u{1F381}',
  communication: '\u{1F4F1}',
  通讯: '\u{1F4F1}',
  salary: '\u{1F4BC}',
  工资: '\u{1F4BC}',
  bonus: '\u{1F4C8}',
  奖金: '\u{1F4C8}',
  investment: '\u{1F4B0}',
  投资: '\u{1F4B0}',
  other: '\u{1F4B5}',
  其他: '\u{1F4B5}',
  digital: '\u{1F4BB}',
  电器数码: '\u{1F4BB}',
  snack: '\u{1F354}',
  零食: '\u{1F354}',
  beauty: '\u{1F484}',
  美容: '\u{1F484}',
};

export interface AddTransactionScreenProps {
  onClose?: () => void;
  onEditCategories?: () => void;
  onSuccess?: () => void;
  initialCategoryId?: string;
  initialAccountId?: string;
}

export function AddTransactionScreen({
  onClose,
  onEditCategories,
  onSuccess,
  initialCategoryId,
  initialAccountId,
}: AddTransactionScreenProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();

  // ---- Store ----
  const draft = useTransactionDraft(
    useShallow((s) => ({
      type: s.type,
      amount: s.amount,
      categoryId: s.categoryId,
      accountId: s.accountId,
      toAccountId: s.toAccountId,
      note: s.note,
      date: s.date,
      recurrence: s.recurrence,
      isEditingNote: s.isEditingNote,
      showCategoryPopover: s.showCategoryPopover,
      showDatePicker: s.showDatePicker,
      showLoopPopover: s.showLoopPopover,
      showCustomLoop: s.showCustomLoop,
      showAccountPicker: s.showAccountPicker,
      noteInputWidth: s.noteInputWidth,
    }))
  );

  const actions = useTransactionDraft(
    useShallow((s) => ({
      setCategoryId: s.setCategoryId,
      setAccountId: s.setAccountId,
      setNote: s.setNote,
      setDate: s.setDate,
      setIsEditingNote: s.setIsEditingNote,
      setShowCategoryPopover: s.setShowCategoryPopover,
      setShowDatePicker: s.setShowDatePicker,
      setShowLoopPopover: s.setShowLoopPopover,
      setShowCustomLoop: s.setShowCustomLoop,
      setShowAccountPicker: s.setShowAccountPicker,
      setNoteInputWidth: s.setNoteInputWidth,
      setRecurrence: s.setRecurrence,
      appendDigit: s.appendDigit,
      deleteLastChar: s.deleteLastChar,
      switchType: s.switchType,
      applySuggestion: s.applySuggestion,
      selectAccount: s.selectAccount,
      resetDraft: s.resetDraft,
      init: s.init,
    }))
  );

  const noteInputRef = useRef<TextInput>(null);

  // Shake animations for validation feedback
  const { translateX: amountShakeX, shake: shakeAmount } = useShakeAnimation();
  const { translateX: categoryShakeX, shake: shakeCategory } = useShakeAnimation();

  const { addTransaction, isSubmitting } = useAddTransaction();
  const { categories, expenseCategories, incomeCategories } = useCategories();
  const { accounts, defaultAccount } = useAccounts();
  const { suggestions, search: searchNotes, clear: clearSuggestions } = useNoteSearch();

  // Refresh categories/accounts when screen regains focus
  useRefetchOnFocus([queryKeys.categories.all, queryKeys.accounts.all]);

  // 初始化草稿
  useEffect(() => {
    actions.init({ categoryId: initialCategoryId, accountId: initialAccountId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 设置默认账户
  useEffect(() => {
    if (!draft.accountId && defaultAccount) {
      actions.setAccountId(defaultAccount.id);
    }
  }, [draft.accountId, defaultAccount, actions]);

  // 设置默认分类
  useEffect(() => {
    if (!draft.categoryId) {
      if (draft.type === 'transfer') {
        actions.setCategoryId(TRANSFER_CATEGORY_ID);
      } else {
        const defaultCats = draft.type === 'expense' ? expenseCategories : incomeCategories;
        if (defaultCats.length > 0) {
          actions.setCategoryId(defaultCats[0].id);
        }
      }
    }
  }, [draft.categoryId, draft.type, expenseCategories, incomeCategories, actions]);

  // ---- Derived ----

  const categoryName = useMemo(() => {
    if (!draft.categoryId) return 'Category';
    return categories.find((c) => c.id === draft.categoryId)?.name ?? 'Category';
  }, [draft.categoryId, categories]);

  const popoverCategories = useMemo((): CategoryPopoverItem[] => {
    const cats = draft.type === 'expense' ? expenseCategories : incomeCategories;
    return [...cats].reverse().map((cat) => ({
      id: cat.id,
      emoji: CATEGORY_EMOJIS[cat.name.toLowerCase()] || CATEGORY_EMOJIS[cat.name] || '\u{1F4C1}',
      label: cat.name,
    }));
  }, [draft.type, expenseCategories, incomeCategories]);

  const dateDisplay = useMemo(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = draft.date.getDate();
    const month = months[draft.date.getMonth()];
    const hours = String(draft.date.getHours()).padStart(2, '0');
    const minutes = String(draft.date.getMinutes()).padStart(2, '0');

    if (isSameDay(draft.date, today)) {
      return { dateText: `Today, ${day} ${month}`, timeText: `${hours}:${minutes}` };
    }
    if (isSameDay(draft.date, yesterday)) {
      return { dateText: `Yesterday, ${day} ${month}`, timeText: `${hours}:${minutes}` };
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDay = weekDays[draft.date.getDay()];
    return { dateText: `${weekDay}, ${day} ${month}`, timeText: `${hours}:${minutes}` };
  }, [draft.date]);

  const sourceAccountName = useMemo(() => {
    if (!draft.accountId) return 'Account';
    return accounts.find((a) => a.id === draft.accountId)?.name ?? 'Account';
  }, [draft.accountId, accounts]);

  const targetAccountName = useMemo(() => {
    if (!draft.toAccountId) return 'Target';
    return accounts.find((a) => a.id === draft.toAccountId)?.name ?? 'Target';
  }, [draft.toAccountId, accounts]);

  const targetAccounts = useMemo(
    () => accounts.filter((a) => !a.isArchived && a.id !== draft.accountId),
    [accounts, draft.accountId]
  );

  // ---- Handlers (thin wrappers) ----

  const handleTypeChange = useCallback(
    (v: string) => actions.switchType(v as TransactionType, expenseCategories, incomeCategories),
    [actions, expenseCategories, incomeCategories]
  );

  const handleKeyPress = useCallback(
    (key: string) => actions.appendDigit(key),
    [actions]
  );

  const handleNoteChange = useCallback(
    (text: string) => {
      actions.setNote(text);
      searchNotes(text);
    },
    [actions, searchNotes]
  );

  const handleNoteBlur = useCallback(() => {
    if (!draft.note.trim()) {
      actions.setIsEditingNote(false);
      clearSuggestions();
    }
  }, [draft.note, actions, clearSuggestions]);

  const handleSelectSuggestion = useCallback(
    (suggestion: { note: string; amount: number; categoryId: string; type: 'expense' | 'income' }) => {
      actions.applySuggestion(suggestion);
      clearSuggestions();
    },
    [actions, clearSuggestions]
  );

  const handleLoopSelect = useCallback(
    (value: LoopValue) => {
      if (value === 'custom') {
        actions.setShowLoopPopover(false);
        actions.setShowCustomLoop(true);
      } else {
        actions.setRecurrence({ type: value });
        actions.setShowLoopPopover(false);
      }
    },
    [actions]
  );

  const handleCustomLoopConfirm = useCallback(
    (interval: number, unit: LoopUnit) => {
      actions.setRecurrence({ type: 'custom', interval, unit });
      actions.setShowCustomLoop(false);
    },
    [actions]
  );

  const handleDateChange = useCallback(
    (newDate: Date) => {
      actions.setDate(newDate);
      actions.setShowDatePicker(false);
    },
    [actions]
  );

  const handleSelectCategory = useCallback(
    (category: CategoryPopoverItem) => {
      actions.setCategoryId(category.id);
      actions.setShowCategoryPopover(false);
    },
    [actions]
  );

  const handleConfirm = useCallback(async () => {
    // Validate amount first
    const amountValue = parseFloat(draft.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      shakeAmount();
      return;
    }

    // Validate category (for non-transfer types)
    if (!draft.categoryId && draft.type !== 'transfer') {
      shakeCategory();
      return;
    }

    if (!draft.accountId) {
      Alert.alert('提示', '请选择账户');
      return;
    }
    if (draft.type === 'transfer' && !draft.toAccountId) {
      Alert.alert('提示', '请选择目标账户');
      return;
    }
    if (draft.type === 'transfer' && draft.accountId === draft.toAccountId) {
      Alert.alert('提示', '不能转账到同一账户');
      return;
    }

    const amountInCents = Math.round(amountValue * 100);

    // For transfer type, use TRANSFER_CATEGORY_ID; otherwise use selected categoryId
    const finalCategoryId = draft.type === 'transfer' ? TRANSFER_CATEGORY_ID : draft.categoryId;
    if (!finalCategoryId) {
      shakeCategory();
      return;
    }

    try {
      await addTransaction({
        type: draft.type,
        amount: amountInCents,
        categoryId: finalCategoryId,
        accountId: draft.accountId,
        toAccountId: draft.type === 'transfer' ? draft.toAccountId : undefined,
        note: draft.note || undefined,
        date: draft.date.getTime(),
      });

      actions.resetDraft();
      clearSuggestions();
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      Alert.alert('错误', err?.message ?? '保存失败，请重试');
    }
  }, [draft, addTransaction, actions, clearSuggestions, onSuccess, onClose, shakeAmount, shakeCategory]);

  const handleStartEditNote = useCallback(() => {
    actions.setIsEditingNote(true);
    noteInputRef.current?.focus();
  }, [actions]);

  // ---- Render ----

  const isTransfer = draft.type === 'transfer';
  const hasCategory = draft.categoryId !== undefined;
  const hasRecurrence = draft.recurrence.type !== 'none';

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}
    >
      {/* Header */}
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 }}>
        <Pressable onPress={onClose} style={{ padding: 8 }}>
          <Icon as={X} size={24} color={colors.foreground} />
        </Pressable>
        <SegmentControl
          options={TRANSACTION_TYPES}
          value={draft.type}
          onValueChange={handleTypeChange}
        />
        <Pressable onPress={() => actions.setShowLoopPopover(true)} style={{ padding: 8 }}>
          <Icon as={RefreshCw} size={24} color={hasRecurrence ? colors.primary : colors.foreground} />
        </Pressable>
      </View>

      {/* Amount Section */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {/* Amount Row */}
        <Animated.View
          style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 16, transform: [{ translateX: amountShakeX }] }}
        >
          {/* Spacer (balances delete button) */}
          <View style={{ height: 44, width: 44, opacity: 0 }} />
          {/* Amount Display */}
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' }}>
            <Text style={{ fontSize: 36, lineHeight: 43, color: colors.mutedForeground }}>¥</Text>
            <Text style={{ fontSize: 64, lineHeight: 77, color: colors.foreground }}>{draft.amount}</Text>
          </View>
          {/* Delete Button */}
          <Pressable
            onPress={actions.deleteLastChar}
            style={{ height: 44, width: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.card }}
          >
            <Icon as={Delete} size={20} color={colors.mutedForeground} />
          </Pressable>
        </Animated.View>

        {/* Add Note Button */}
        <Pressable
          onPress={handleStartEditNote}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderRadius: 9999,
            borderWidth: 0.5,
            borderColor: colors.border,
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <Icon as={Menu} size={16} color={colors.mutedForeground} />
          <View>
            <Text
              style={{ position: 'absolute', fontSize: 14, opacity: 0 }}
              onLayout={(e) => {
                const measured = Math.ceil(e.nativeEvent.layout.width);
                actions.setNoteInputWidth(Math.max(62, measured + 2));
              }}
            >
              {draft.note || 'Add Note'}
            </Text>
            <TextInput
              ref={noteInputRef}
              value={draft.note}
              onChangeText={handleNoteChange}
              onBlur={handleNoteBlur}
              editable={draft.isEditingNote}
              placeholder="Add Note"
              placeholderTextColor={colors.mutedForeground}
              style={{
                margin: 0,
                padding: 0,
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontSize: 14,
                color: draft.note ? colors.foreground : colors.mutedForeground,
                width: draft.noteInputWidth,
              }}
            />
          </View>
        </Pressable>
      </View>

      {/* Bottom Section - design: padding [16, 16, 32, 16], gap-4 */}
      <View style={{ gap: 16, paddingHorizontal: 16, paddingTop: 16, paddingBottom: Math.max(32, insets.bottom + 16) }}>
        {/* Suggestion Chips */}
        {suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {suggestions.map((suggestion, index) => (
              <Pressable
                key={`${suggestion.note}-${index}`}
                onPress={() => handleSelectSuggestion(suggestion)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                }}
              >
                <Text style={{ fontSize: 14 }} color={colors.foreground}>{suggestion.note}</Text>
                <Text style={{ fontSize: 12 }} color={colors.mutedForeground}>
                  ¥{(suggestion.amount / 100).toFixed(suggestion.amount % 100 === 0 ? 0 : 2)}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* Selectors Row */}
        {isTransfer ? (
          <View style={{ width: '100%', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Pressable
                onPress={() => actions.setShowAccountPicker('source')}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12 }}
              >
                <Icon as={Wallet} size={16} color={colors.foreground} />
                <Text style={{ fontSize: 14, fontWeight: '500' }} color={colors.foreground}>{sourceAccountName}</Text>
              </Pressable>
              <Icon as={ArrowRightLeft} size={16} color={colors.mutedForeground} />
              <Pressable
                onPress={() => actions.setShowAccountPicker('target')}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12 }}
              >
                <Icon as={Wallet} size={16} color={draft.toAccountId ? colors.foreground : colors.mutedForeground} />
                <Text style={{ fontSize: 14, fontWeight: '500' }} color={draft.toAccountId ? colors.foreground : colors.mutedForeground}>
                  {targetAccountName}
                </Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => actions.setShowDatePicker(true)}
              style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 9999, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 12 }}
            >
              <Icon as={Calendar} size={16} color={colors.foreground} />
              <Text style={{ fontSize: 14, fontWeight: '500' }} color={colors.foreground}>{dateDisplay.dateText}</Text>
              <Text style={{ fontSize: 14 }} color={colors.foreground}>{dateDisplay.timeText}</Text>
            </Pressable>
          </View>
        ) : (
          /* Selectors Row - design: justifyContent space-between, gap-3 */
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
            {/* Date Selector - design: rounded-full, bg-card, border 0.5px, gap-2, padding [12, 16] */}
            <Pressable
              onPress={() => actions.setShowDatePicker(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 12 }}
            >
              <Icon as={Calendar} size={16} color={colors.foreground} />
              <Text style={{ fontSize: 14, fontFamily: 'NotoSansSC_500Medium' }} color={colors.foreground}>{dateDisplay.dateText}</Text>
              <Text style={{ fontSize: 14 }} color={colors.foreground}>{dateDisplay.timeText}</Text>
            </Pressable>
            {/* Category Selector - design: rounded-full, bg-card, border 0.5px, gap-2, padding [12, 16] */}
            <Animated.View style={{ transform: [{ translateX: categoryShakeX }] }}>
              <Pressable
                onPress={() => actions.setShowCategoryPopover(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 9999, borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 12 }}
              >
                <Icon as={Grid2x2} size={16} color={hasCategory ? colors.foreground : colors.mutedForeground} />
                <Text style={{ fontSize: 14 }} color={hasCategory ? colors.foreground : colors.mutedForeground}>
                  {categoryName}
                </Text>
              </Pressable>
            </Animated.View>
          </View>
        )}

        {/* Numpad */}
        <Numpad
          showOperators={false}
          onKeyPress={isSubmitting ? () => {} : handleKeyPress}
          onDelete={isSubmitting ? () => {} : actions.deleteLastChar}
          onConfirm={isSubmitting ? () => {} : handleConfirm}
        />

        {isSubmitting && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: `${colors.background}80` }}>
            <ActivityIndicator size="large" />
          </View>
        )}
      </View>

      {/* Category Popover */}
      <CategoryPopover
        visible={draft.showCategoryPopover}
        categories={popoverCategories}
        onSelect={handleSelectCategory}
        onClose={() => actions.setShowCategoryPopover(false)}
        onEdit={onEditCategories}
      />

      {/* Date Time Picker */}
      <DateTimePicker
        visible={draft.showDatePicker}
        date={draft.date}
        onDateChange={handleDateChange}
        onClose={() => actions.setShowDatePicker(false)}
      />

      {/* Loop Popover */}
      <LoopPopover
        visible={draft.showLoopPopover}
        selectedValue={draft.recurrence.type}
        onSelect={handleLoopSelect}
        onClose={() => actions.setShowLoopPopover(false)}
      />

      {/* Custom Loop Dialog */}
      <CustomLoopDialog
        visible={draft.showCustomLoop}
        onConfirm={handleCustomLoopConfirm}
        onClose={() => actions.setShowCustomLoop(false)}
      />

      {/* Account Picker Modal (for transfer) */}
      <Modal
        visible={draft.showAccountPicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => actions.setShowAccountPicker(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={() => actions.setShowAccountPicker(null)}
        />
        <View style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.background, paddingHorizontal: 16, paddingBottom: 32, paddingTop: 16 }}>
          <Text style={{ marginBottom: 16, textAlign: 'center', fontSize: 16, fontWeight: '600' }} color={colors.foreground}>
            {draft.showAccountPicker === 'source' ? '选择来源账户' : '选择目标账户'}
          </Text>
          {(draft.showAccountPicker === 'target' ? targetAccounts : accounts.filter((a) => !a.isArchived)).map((account) => {
            const isSelected = draft.showAccountPicker === 'source'
              ? account.id === draft.accountId
              : account.id === draft.toAccountId;
            return (
              <Pressable
                key={account.id}
                onPress={() => actions.selectAccount(account.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: isSelected ? `${colors.primary}1A` : 'transparent' }}
              >
                <Icon as={Wallet} size={20} color={isSelected ? colors.primary : colors.mutedForeground} />
                <Text style={{ flex: 1, fontSize: 16, fontWeight: isSelected ? '600' : '400' }} color={isSelected ? colors.primary : colors.foreground}>
                  {account.name}
                </Text>
                {isSelected && (
                  <Text style={{ fontSize: 14 }} color={colors.primary}>✓</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </Modal>
    </View>
  );
}
