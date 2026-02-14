import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, styled, useTheme } from 'tamagui';
import type { ComponentProps } from 'react';

type IconName = keyof typeof Ionicons.glyphMap;

const FabContainer = styled(XStack, {
  backgroundColor: '$primary',
  borderRadius: 9999,
  height: 56,
  minWidth: 56,
  paddingHorizontal: 18,
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  shadowColor: '$cardShadow',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 10,
  elevation: 8,
  pressStyle: { scale: 0.96 },
  variants: {
    floating: {
      true: {
        position: 'absolute',
        right: 20,
        bottom: 20,
      },
    },
  } as const,
  defaultVariants: {
    floating: true,
  },
});

interface QuickAddFABProps extends ComponentProps<typeof FabContainer> {
  label?: string;
  iconName?: IconName;
}

export function QuickAddFAB({
  label = 'Add Expense',
  iconName = 'add',
  ...props
}: QuickAddFABProps) {
  const theme = useTheme();

  return (
    <FabContainer {...props}>
      <Ionicons name={iconName} size={22} color={theme.textInverse?.val} />
      {label ? (
        <Text color="$textInverse" fontSize={14} fontWeight="600">
          {label}
        </Text>
      ) : null}
    </FabContainer>
  );
}
