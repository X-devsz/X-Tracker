import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { XStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';
import { AppInput } from '../atoms';

const SearchContainer = styled(XStack, {
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  alignItems: 'center',
  gap: 8,
  height: 52,
  animation: 'fast',
  pressStyle: { borderColor: '$borderFocused', backgroundColor: '$surfaceHover' },
});

const ClearButton = styled(XStack, {
  width: 28,
  height: 28,
  borderRadius: 9999,
  alignItems: 'center',
  justifyContent: 'center',
  pressStyle: { scale: 0.96, backgroundColor: '$surfaceHover' },
});

interface SearchBarProps
  extends Omit<ComponentProps<typeof AppInput>, 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export function SearchBar({
  value,
  onChangeText,
  onDebouncedChange,
  debounceMs = 250,
  onClear,
  placeholder = 'Search',
  ...props
}: SearchBarProps) {
  const theme = useTheme();

  useEffect(() => {
    if (!onDebouncedChange) return;
    const handle = setTimeout(() => onDebouncedChange(value), debounceMs);
    return () => clearTimeout(handle);
  }, [value, onDebouncedChange, debounceMs]);

  return (
    <SearchContainer>
      <Ionicons name="search" size={18} color={theme.textTertiary?.val} />
      <AppInput
        placeholder={placeholder}
        placeholderTextColor={theme.textTertiary?.val}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {value.length > 0 ? (
        <ClearButton
          onPress={() => {
            onClear?.();
            onChangeText('');
          }}
        >
          <Ionicons name="close" size={16} color={theme.textTertiary?.val} />
        </ClearButton>
      ) : null}
    </SearchContainer>
  );
}
