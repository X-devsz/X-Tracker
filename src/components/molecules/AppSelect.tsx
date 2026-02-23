import { useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { FontSizeTokens, SelectProps } from 'tamagui';
import {
  Adapt,
  Label,
  Select,
  Sheet,
  Text,
  XStack,
  YStack,
  getFontSize,
} from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { triggerHaptic } from '../../services/haptics';

export interface AppSelectItem {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface AppSelectProps
  extends Omit<SelectProps<string>, 'value' | 'onValueChange'> {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  items: AppSelectItem[];
  trigger?: ReactNode;
  native?: boolean;
  width?: number;
}

export function AppSelect({
  id,
  label,
  placeholder = 'Select',
  value,
  onValueChange,
  items,
  trigger,
  native,
  width = 190,
  size,
  ...props
}: AppSelectProps) {
  const getItemLabel = (itemValue: string) =>
    items.find((item) => item.value === itemValue)?.label ?? itemValue;

  const renderItems = useMemo(
    () =>
      items.map((item, index) => (
        <Select.Item index={index} key={item.value} value={item.value}>
          <XStack alignItems="center" gap="$3" flex={1}>
            {item.icon ? (
              <XStack
                width={24}
                height={24}
                alignItems="center"
                justifyContent="center"
              >
                {item.icon}
              </XStack>
            ) : null}
            <YStack flex={1} gap="$1">
              <Select.ItemText>{item.label}</Select.ItemText>
              {item.description ? (
                <Text color="$textSecondary" fontSize={12}>
                  {item.description}
                </Text>
              ) : null}
            </YStack>
          </XStack>
          <Select.ItemIndicator marginLeft="auto">
            <Check size={16} />
          </Select.ItemIndicator>
        </Select.Item>
      )),
    [items],
  );

  const handleValueChange = useCallback(
    (nextValue: string) => {
      triggerHaptic('selection');
      onValueChange(nextValue);
    },
    [onValueChange],
  );

  return (
    <YStack gap="$2">
      {label ? (
        <Label htmlFor={id} flex={1} minWidth={80} color="$textSecondary" fontSize={12}>
          {label}
        </Label>
      ) : null}
      <Select
        value={value}
        onValueChange={handleValueChange}
        disablePreventBodyScroll
        {...props}
        renderValue={getItemLabel}
      >
        {trigger ?? (
          <Select.Trigger
            id={id}
            width={width}
            iconAfter={ChevronDown}
            borderRadius="$4"
            borderWidth={1}
            backgroundColor="$surface"
            borderColor="$border"
          >
            <Select.Value placeholder={placeholder} />
          </Select.Trigger>
        )}

        <Adapt when="md" platform="touch">
          <Sheet native={!!native} modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$overlay"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronUp size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['$background', 'transparent']}
              borderRadius="$4"
            />
          </Select.ScrollUpButton>
          <Select.Viewport
            minWidth={width}
            bg="$background"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$border"
          >
            <Select.Group>{renderItems}</Select.Group>
            {native ? (
              <YStack
                position="absolute"
                right={0}
                top={16}
                alignItems="center"
                justifyContent="center"
                width="$4"
                pointerEvents="none"
              >
                <ChevronDown
                  size={getFontSize((size as FontSizeTokens) ?? '$true')}
                />
              </YStack>
            ) : null}
          </Select.Viewport>

          <Select.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ChevronDown size={20} />
            </YStack>
            <LinearGradient
              start={[0, 0]}
              end={[0, 1]}
              fullscreen
              colors={['transparent', '$background']}
              borderRadius="$4"
            />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </YStack>
  );
}
