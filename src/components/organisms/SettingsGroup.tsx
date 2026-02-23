import { Ionicons } from '@expo/vector-icons';
import { Switch } from 'react-native';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import type { ReactNode } from 'react';
import { AppDivider } from '../atoms';
import { triggerHaptic } from '../../services/haptics';

type IconName = keyof typeof Ionicons.glyphMap;

const GroupContainer = styled(YStack, {
  backgroundColor: '$cardBackground',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '$cardBorder',
  overflow: 'hidden',
});

const RowContainer = styled(XStack, {
  paddingHorizontal: 16,
  paddingVertical: 14,
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  variants: {
    interactive: {
      true: {
        pressStyle: { backgroundColor: '$surfaceHover' },
      },
    },
  } as const,
});

const RowText = styled(YStack, {
  flex: 1,
  gap: 4,
});

export interface SettingsRow {
  id: string;
  label: string;
  description?: string;
  iconName?: IconName;
  tone?: 'default' | 'danger';
  type?: 'toggle' | 'navigation' | 'action';
  value?: boolean;
  detail?: string;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  rightElement?: ReactNode;
}

interface SettingsGroupProps {
  title?: string;
  rows: SettingsRow[];
}

export function SettingsGroup({ title, rows }: SettingsGroupProps) {
  const theme = useTheme();

  return (
    <YStack gap={12}>
      {title ? (
        <Text color="$textSecondary" fontSize={12} fontWeight="600">
          {title}
        </Text>
      ) : null}
      <GroupContainer>
        {rows.map((row, index) => {
          const isToggle = row.type === 'toggle';
          const isNavigation = row.type === 'navigation';
          const labelColor = row.tone === 'danger' ? '$danger' : '$textPrimary';
          const iconColor =
            row.tone === 'danger' ? theme.danger?.val : theme.textSecondary?.val;

          return (
            <YStack key={row.id}>
              <RowContainer
                interactive={Boolean(row.onPress)}
                onPress={
                  row.onPress
                    ? () => {
                        triggerHaptic('selection');
                        row.onPress?.();
                      }
                    : undefined
                }
              >
                <XStack alignItems="center" gap={12} flex={1}>
                  {row.iconName ? (
                    <Ionicons
                      name={row.iconName}
                      size={18}
                      color={iconColor}
                    />
                  ) : null}
                  <RowText>
                    <Text color={labelColor} fontSize={15} fontWeight="600">
                      {row.label}
                    </Text>
                    {row.description ? (
                      <Text color="$textSecondary" fontSize={12}>
                        {row.description}
                      </Text>
                    ) : null}
                  </RowText>
                </XStack>
                {row.rightElement ? (
                  row.rightElement
                ) : isToggle ? (
                  <Switch
                    value={Boolean(row.value)}
                    onValueChange={(next) => {
                      triggerHaptic('selection');
                      row.onToggle?.(next);
                    }}
                    trackColor={{
                      false: theme.border?.val ?? '#DDD',
                      true: theme.primary?.val ?? '#6366F1',
                    }}
                    thumbColor="#FFFFFF"
                  />
                ) : (
                  <XStack alignItems="center" gap={6}>
                    {row.detail ? (
                      <Text color="$textSecondary" fontSize={12}>
                        {row.detail}
                      </Text>
                    ) : null}
                    {isNavigation ? (
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={theme.textTertiary?.val}
                      />
                    ) : null}
                  </XStack>
                )}
              </RowContainer>
              {index < rows.length - 1 ? <AppDivider /> : null}
            </YStack>
          );
        })}
      </GroupContainer>
    </YStack>
  );
}
