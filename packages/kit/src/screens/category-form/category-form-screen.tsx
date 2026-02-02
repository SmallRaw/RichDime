import { useState, useCallback, useRef } from 'react';
import { View, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Icon, Text, SegmentControl, EmojiPicker, ColorPicker, useThemeColors } from '@rich-dime/component';
import { X, Plus, Trash2, Check } from 'lucide-react-native';
import { useCategories } from '../../hooks/database';
import type { Category } from '@rich-dime/database';

const CATEGORY_TYPES = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

const AVAILABLE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#f97316',
  '#a855f7',
  '#06b6d4',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#78716c',
  '#6366f1',
  '#8b5cf6',
  '#f472b6',
  '#22c55e',
  '#64748b',
];

const DEFAULT_EMOJI = '😀';
const DEFAULT_COLOR = '#ec4899';

export interface CategoryFormScreenProps {
  mode: 'add' | 'edit';
  category?: Category;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function CategoryFormScreen({
  mode,
  category,
  onClose,
  onSuccess,
}: CategoryFormScreenProps) {
  const themeColors = useThemeColors();
  const [type, setType] = useState<'expense' | 'income'>(
    (category?.type as 'expense' | 'income') ?? 'expense'
  );
  const [name, setName] = useState(category?.name ?? '');
  const [emoji, setEmoji] = useState(category?.icon ?? DEFAULT_EMOJI);
  const [color, setColor] = useState(category?.color ?? DEFAULT_COLOR);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Use ref to track color index for cycling without triggering re-renders
  const colorIndexRef = useRef(
    AVAILABLE_COLORS.indexOf(category?.color ?? DEFAULT_COLOR)
  );

  const { addCategory, editCategory, removeCategory } = useCategories();

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType as 'expense' | 'income');
  }, []);

  const handleColorCycle = useCallback(() => {
    const nextIndex = (colorIndexRef.current + 1) % AVAILABLE_COLORS.length;
    colorIndexRef.current = nextIndex;
    setColor(AVAILABLE_COLORS[nextIndex]);
  }, []);

  const handleEmojiSelect = useCallback((selectedEmoji: string) => {
    setEmoji(selectedEmoji);
    setShowEmojiPicker(false);
  }, []);

  const handleColorSelect = useCallback((selectedColor: string) => {
    setColor(selectedColor);
    colorIndexRef.current = AVAILABLE_COLORS.indexOf(selectedColor);
    setShowColorPicker(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'add') {
        await addCategory({
          name: trimmedName,
          type,
          icon: emoji,
          color,
        });
      } else if (category) {
        await editCategory(category.id, {
          name: trimmedName,
          icon: emoji,
          color,
        });
      }
      onSuccess?.();
      onClose?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Operation failed. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  }, [name, type, emoji, color, mode, category, addCategory, editCategory, onSuccess, onClose]);

  const handleDelete = useCallback(() => {
    if (!category) return;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsSubmitting(true);
            try {
              await removeCategory(category.id);
              onSuccess?.();
              onClose?.();
            } catch (err) {
              const message =
                err instanceof Error ? err.message : 'Delete failed. Please try again.';
              Alert.alert('Error', message);
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  }, [category, removeCategory, onSuccess, onClose]);

  return (
    <View className="bg-background" style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        {/* Close Button - styled differently for add vs edit mode */}
        <Pressable
          onPress={onClose}
          className={`h-8 w-8 items-center justify-center ${mode === 'edit' ? 'rounded-full bg-muted' : ''}`}
        >
          <Icon as={X} size={18} className="text-muted-foreground" />
        </Pressable>

        {/* Segment Control */}
        <SegmentControl
          options={CATEGORY_TYPES}
          value={type}
          onValueChange={handleTypeChange}
        />

        {/* Right Side: Delete (edit mode) or empty placeholder (add mode) */}
        {mode === 'edit' ? (
          <Pressable
            onPress={handleDelete}
            className="h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: themeColors.destructive }}
          >
            <Icon as={Trash2} size={16} className="text-white" />
          </Pressable>
        ) : (
          <View className="h-8 w-8" />
        )}
      </View>

      {/* Content */}
      <View className="items-center gap-6 px-4 pb-4 pt-8">
        {/* Emoji Preview */}
        <Pressable
          onPress={() => setShowEmojiPicker(true)}
          className="h-[72px] w-[72px] items-center justify-center rounded-lg bg-muted"
        >
          <Text className="text-4xl">{emoji}</Text>
        </Pressable>

        {/* Input Row */}
        <View className="w-full flex-row items-center gap-3">
          {/* Color Picker */}
          <Pressable
            onPress={() => setShowColorPicker(true)}
            className="h-8 w-8 rounded-lg"
            style={{ backgroundColor: color }}
          />

          {/* Name Input */}
          <TextInput
            className="h-11 flex-1 rounded-lg bg-muted px-3 text-[15px] text-foreground"
            placeholder="Category Name"
            placeholderTextColor={themeColors.mutedForeground}
            value={name}
            onChangeText={setName}
            editable={!isSubmitting}
            autoFocus={mode === 'add'}
          />

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="h-11 w-11 items-center justify-center rounded-lg bg-foreground"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={themeColors.background} />
            ) : (
              <Icon
                as={mode === 'add' ? Plus : Check}
                size={24}
                className="text-background"
              />
            )}
          </Pressable>
        </View>
      </View>

      {/* Emoji Picker */}
      <EmojiPicker
        visible={showEmojiPicker}
        selectedEmoji={emoji}
        onSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />

      {/* Color Picker */}
      <ColorPicker
        visible={showColorPicker}
        selectedColor={color}
        onSelect={handleColorSelect}
        onClose={() => setShowColorPicker(false)}
      />
    </View>
  );
}
