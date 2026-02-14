import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import type { ReactNode } from 'react';

type IconName = keyof typeof Ionicons.glyphMap;

export interface CategoryOption {
  id: string;
  label: string;
  color?: string;
  iconName?: IconName;
  icon?: ReactNode;
  isFavorite?: boolean;
}

const CategoryGrid = styled(XStack, {
  flexWrap: 'wrap',
  gap: 12,
});

const CategoryCard = styled(XStack, {
  width: '48%',
  backgroundColor: '$surface',
  borderRadius: 14,
  borderWidth: 1,
  borderColor: '$border',
  paddingHorizontal: 12,
  paddingVertical: 12,
  alignItems: 'center',
  gap: 10,
  animation: 'fast',
  pressStyle: { scale: 0.98, backgroundColor: '$surfaceHover' },
  variants: {
    selected: {
      true: {
        backgroundColor: '$primaryLight',
        borderColor: '$primary',
      },
    },
  } as const,
});

const IconBadge = styled(YStack, {
  width: 36,
  height: 36,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
});

interface CategoryPickerProps {
  label?: string;
  categories: CategoryOption[];
  selectedId?: string;
  onSelect?: (category: CategoryOption) => void;
}

export function CategoryPicker({
  label = 'Category',
  categories,
  selectedId,
  onSelect,
}: CategoryPickerProps) {
  const theme = useTheme();
  const ordered = [...categories].sort(
    (a, b) => Number(Boolean(b.isFavorite)) - Number(Boolean(a.isFavorite)),
  );

  return (
    <YStack gap={12}>
      <Text color="$textSecondary" fontSize={12} fontWeight="600">
        {label}
      </Text>
      <CategoryGrid>
        {ordered.map((category) => {
          const isSelected = category.id === selectedId;
          const iconColor = category.color ?? theme.primary?.val;
          const badgeColor = category.color ? `${category.color}20` : '$primaryLight';

          return (
            <CategoryCard
              key={category.id}
              selected={isSelected}
              onPress={() => onSelect?.(category)}
            >
              <IconBadge backgroundColor={badgeColor}>
                {category.icon ? (
                  category.icon
                ) : (
                  <Ionicons
                    name={category.iconName ?? 'pricetag-outline'}
                    size={18}
                    color={iconColor}
                  />
                )}
              </IconBadge>
              <Text color="$textPrimary" fontSize={13} fontWeight="600">
                {category.label}
              </Text>
            </CategoryCard>
          );
        })}
      </CategoryGrid>
    </YStack>
  );
}
