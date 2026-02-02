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
    <View style={{ backgroundColor: themeColors.background, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 }}>
        {/* Close Button - styled differently for add vs edit mode */}
        <Pressable
          onPress={onClose}
          style={{ height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: mode === 'edit' ? 9999 : 0, backgroundColor: mode === 'edit' ? themeColors.muted : 'transparent' }}
        >
          <Icon as={X} size={18} color={themeColors.mutedForeground} />
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
            style={{ height: 32, width: 32, alignItems: 'center', justifyContent: 'center', borderRadius: 9999, backgroundColor: themeColors.destructive }}
          >
            <Icon as={Trash2} size={16} color="#ffffff" />
          </Pressable>
        ) : (
          <View style={{ height: 32, width: 32 }} />
        )}
      </View>

      {/* Content */}
      <View style={{ alignItems: 'center', gap: 24, paddingHorizontal: 16, paddingBottom: 16, paddingTop: 32 }}>
        {/* Emoji Preview */}
        <Pressable
          onPress={() => setShowEmojiPicker(true)}
          style={{ height: 72, width: 72, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: themeColors.muted }}
        >
          <Text style={{ fontSize: 36 }}>{emoji}</Text>
        </Pressable>

        {/* Input Row */}
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {/* Color Picker */}
          <Pressable
            onPress={() => setShowColorPicker(true)}
            style={{ height: 32, width: 32, borderRadius: 8, backgroundColor: color }}
          />

          {/* Name Input */}
          <TextInput
            style={{ height: 44, flex: 1, borderRadius: 8, backgroundColor: themeColors.muted, paddingHorizontal: 12, fontSize: 15, color: themeColors.foreground }}
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
            style={{ height: 44, width: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 8, backgroundColor: themeColors.foreground }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={themeColors.background} />
            ) : (
              <Icon
                as={mode === 'add' ? Plus : Check}
                size={24}
                color={themeColors.background}
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
