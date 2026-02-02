import * as React from 'react';
import { View, Pressable, Animated, Platform } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';
import WheelPicker from '@quidone/react-native-wheel-picker';

// --- Date option generation ---

interface DateOption {
  value: number; // offset from today (-30 to +7)
  label: string;
  date: Date;
}

const WEEKDAYS_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function generateDateOptions(): DateOption[] {
  const options: DateOption[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = -30; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const weekday = WEEKDAYS_CN[d.getDay()];

    let label: string;
    if (i === 0) label = '今天';
    else if (i === -1) label = '昨天';
    else label = `${month}月${day}日 ${weekday}`;

    options.push({ value: i, label, date: d });
  }
  return options;
}

function generateHourOptions(): { value: number; label: string }[] {
  return Array.from({ length: 24 }, (_, i) => ({
    value: i,
    label: String(i).padStart(2, '0'),
  }));
}

function generateMinuteOptions(): { value: number; label: string }[] {
  return Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: String(i).padStart(2, '0'),
  }));
}

const DATE_OPTIONS = generateDateOptions();
const HOUR_OPTIONS = generateHourOptions();
const MINUTE_OPTIONS = generateMinuteOptions();

// --- Types ---

export interface DateTimePickerProps {
  visible: boolean;
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
}

// --- Helpers ---

function dateToOffset(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(-30, Math.min(7, diff));
}

// --- Component ---

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 5;

function DateTimePicker({ visible, date, onDateChange, onClose }: DateTimePickerProps) {
  const themeColors = useThemeColors();
  const isDark = themeColors.isDark;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(300)).current;

  // Picker value state — drives wheel position, updated each time picker opens
  const [pickerDateOffset, setPickerDateOffset] = React.useState(() => dateToOffset(date));
  const [pickerHour, setPickerHour] = React.useState(() => date.getHours());
  const [pickerMinute, setPickerMinute] = React.useState(() => date.getMinutes());

  // Current selected values (logic values - useRef to avoid closures)
  const selectedDateOffset = React.useRef(dateToOffset(date));
  const selectedHour = React.useRef(date.getHours());
  const selectedMinute = React.useRef(date.getMinutes());

  // Callbacks for each wheel — update both ref (for confirm) and state (for controlled value)
  const handleDateChange = React.useCallback(({item}: {item: {value: number}}) => {
    selectedDateOffset.current = item.value;
    setPickerDateOffset(item.value);
  }, []);

  const handleHourChange = React.useCallback(({item}: {item: {value: number}}) => {
    selectedHour.current = item.value;
    setPickerHour(item.value);
  }, []);

  const handleMinuteChange = React.useCallback(({item}: {item: {value: number}}) => {
    selectedMinute.current = item.value;
    setPickerMinute(item.value);
  }, []);

  // Web fix: find picker scroll containers in the DOM
  const findScrollContainers = React.useCallback((): HTMLElement[] => {
    if (Platform.OS !== 'web') return [];
    const containers: HTMLElement[] = [];
    document.querySelectorAll('div').forEach((d) => {
      const style = window.getComputedStyle(d);
      if (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        d.scrollHeight > d.clientHeight + 100
      ) {
        containers.push(d);
      }
    });
    return containers;
  }, []);

  // Web fix: apply CSS scroll-snap to picker containers
  // (snapToOffsets doesn't work on react-native-web)
  const applyScrollSnap = React.useCallback(() => {
    if (Platform.OS !== 'web') return;
    const containers = findScrollContainers();
    const paddingOffset = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);
    containers.forEach((container) => {
      container.style.scrollSnapType = 'y mandatory';
      container.style.scrollPaddingTop = `${paddingOffset}px`;
      // Items are inside a wrapper div (single child of the scroll container)
      const wrapper = container.children[0] as HTMLElement | undefined;
      if (!wrapper) return;
      Array.from(wrapper.children).forEach((item) => {
        (item as HTMLElement).style.scrollSnapAlign = 'start';
      });
    });
  }, [findScrollContainers]);

  // Sync picker position and refs when opening
  React.useEffect(() => {
    if (visible) {
      const offset = dateToOffset(date);
      selectedDateOffset.current = offset;
      selectedHour.current = date.getHours();
      selectedMinute.current = date.getMinutes();

      setPickerDateOffset(offset);
      setPickerHour(date.getHours());
      setPickerMinute(date.getMinutes());

      // Web fix: contentOffset doesn't work on react-native-web,
      // so manually scroll the picker containers to the correct position
      // and attach snap-on-scroll-end listeners.
      if (Platform.OS === 'web') {
        const dateIndex = DATE_OPTIONS.findIndex((d) => d.value === offset);
        const hourIndex = date.getHours();
        const minuteIndex = date.getMinutes();
        const targets = [dateIndex * ITEM_HEIGHT, hourIndex * ITEM_HEIGHT, minuteIndex * ITEM_HEIGHT];

        setTimeout(() => {
          const containers = findScrollContainers();
          containers.forEach((c, i) => {
            if (targets[i] != null) {
              c.scrollTop = targets[i];
            }
          });
          // Apply CSS scroll-snap after initial positioning
          applyScrollSnap();
        }, 50);
      }

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, date, fadeAnim, slideAnim, findScrollContainers, applyScrollSnap]);

  const handleConfirm = React.useCallback(() => {
    const dateOption = DATE_OPTIONS.find((d) => d.value === selectedDateOffset.current);
    if (!dateOption) return;

    const result = new Date(dateOption.date);
    result.setHours(selectedHour.current, selectedMinute.current, 0, 0);
    onDateChange(result);
  }, [onDateChange]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: fadeAnim,
      }}
    >
      {/* Overlay */}
      <Pressable
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}
      />

      {/* Bottom Sheet */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View
          style={{
            alignItems: 'center',
            gap: 20,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            backgroundColor: themeColors.card,
            paddingHorizontal: 16,
            paddingBottom: 32,
            paddingTop: 12,
          }}
        >
          {/* Handle */}
          <View
            style={{
              height: 4,
              width: 36,
              borderRadius: 9999,
              backgroundColor: themeColors.mutedForeground,
              opacity: 0.3,
            }}
          />

          {/* Title */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: 18,
              fontFamily: 'NotoSansSC_600SemiBold',
            }}
            color={themeColors.foreground}
          >
            选择日期和时间
          </Text>

          {/* Wheel Picker Area */}
          <View style={{ width: '100%' }}>
            {/* Wheels Row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
              {/* Full-width selection indicator */}
              <View
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: ITEM_HEIGHT * 2,
                  height: ITEM_HEIGHT,
                  backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                  borderRadius: 8,
                }}
              />

              {/* Date Column */}
              <View style={{ flex: 1 }}>
                <WheelPicker
                  data={DATE_OPTIONS}
                  value={pickerDateOffset}
                  onValueChanging={handleDateChange}
                  onValueChanged={handleDateChange}
                  itemHeight={ITEM_HEIGHT}
                  visibleItemCount={VISIBLE_COUNT}
                  enableScrollByTapOnItem
                  renderOverlay={null}
                  itemTextStyle={{ color: themeColors.foreground }}
                />
              </View>

              {/* Hour Column */}
              <View style={{ width: 52 }}>
                <WheelPicker
                  data={HOUR_OPTIONS}
                  value={pickerHour}
                  onValueChanging={handleHourChange}
                  onValueChanged={handleHourChange}
                  itemHeight={ITEM_HEIGHT}
                  visibleItemCount={VISIBLE_COUNT}
                  enableScrollByTapOnItem
                  renderOverlay={null}
                  itemTextStyle={{ color: themeColors.foreground }}
                />
              </View>

              {/* Separator */}
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: 'NotoSansSC_600SemiBold',
                }}
                color={themeColors.foreground}
              >
                :
              </Text>

              {/* Minute Column */}
              <View style={{ width: 52 }}>
                <WheelPicker
                  data={MINUTE_OPTIONS}
                  value={pickerMinute}
                  onValueChanging={handleMinuteChange}
                  onValueChanged={handleMinuteChange}
                  itemHeight={ITEM_HEIGHT}
                  visibleItemCount={VISIBLE_COUNT}
                  enableScrollByTapOnItem
                  renderOverlay={null}
                  itemTextStyle={{ color: themeColors.foreground }}
                />
              </View>
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={handleConfirm}
            style={{
              width: '100%',
              height: 52,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              backgroundColor: themeColors.primary,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'NotoSansSC_600SemiBold',
              }}
              color={themeColors.primaryForeground}
            >
              确认
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export { DateTimePicker };
