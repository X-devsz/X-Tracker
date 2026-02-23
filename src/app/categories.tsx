/**
 * Categories Screen - Manage custom categories
 */
import { useEffect, useMemo, useState, type ComponentProps } from 'react';
import { Switch as TamaguiSwitch } from '@tamagui/switch';
import { useToastController } from '@tamagui/toast';
import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import {
  AppButton,
  AppCard,
  AppIconButton,
  InputField,
  ScreenLayout,
  useAlertDialog,
} from '../components';
import { useCategoryStore } from '../store';
import { categoryColors } from '../theme';
import { resolveCategoryIcon } from '../utils/categories';
import { triggerHaptic } from '../services/haptics';

type IconName = keyof typeof Ionicons.glyphMap;
type CategoryColorToken = keyof typeof categoryColors;

const iconOptions: IconName[] = [
  'fast-food-outline',
  'car-outline',
  'cart-outline',
  'home-outline',
  'heart-outline',
  'film-outline',
  'school-outline',
  'gift-outline',
  'fitness-outline',
  'airplane-outline',
  'cash-outline',
  'ellipsis-horizontal-circle-outline',
];

const colorOptions = Object.keys(categoryColors) as CategoryColorToken[];

const IconOption = styled(XStack, {
  width: 44,
  height: 44,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '$border',
  backgroundColor: '$surface',
  pressStyle: { scale: 0.96, backgroundColor: '$surfaceHover' },
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
        backgroundColor: '$primaryLight',
      },
    },
  } as const,
});

const ColorOption = styled(XStack, {
  width: 32,
  height: 32,
  borderRadius: 9999,
  borderWidth: 2,
  borderColor: 'transparent',
  pressStyle: { scale: 0.96 },
  variants: {
    selected: {
      true: {
        borderColor: '$primary',
      },
    },
  } as const,
});

const resolveTint = (color: string) =>
  `${color}20` as ComponentProps<typeof YStack>['backgroundColor'];

export default function CategoriesScreen() {
  const theme = useTheme();
  const toast = useToastController();
  const { alertDialog, showAlert } = useAlertDialog();
  const {
    categories,
    isLoading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    archiveCategory,
    restoreCategory,
    reorderCategories,
  } = useCategoryStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<IconName>(iconOptions[0]);
  const [colorToken, setColorToken] = useState<CategoryColorToken>(colorOptions[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchCategories(showArchived);
  }, [fetchCategories, showArchived]);

  const activeCategories = useMemo(
    () => categories.filter((category) => !category.isArchived),
    [categories],
  );

  const archivedCategories = useMemo(
    () => categories.filter((category) => category.isArchived),
    [categories],
  );

  const handleReset = () => {
    setName('');
    setIcon(iconOptions[0]);
    setColorToken(colorOptions[0]);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (isSubmitDisabled) return;
    try {
      if (editingId) {
        await updateCategory(editingId, {
          name,
          icon,
          colorToken,
        });
      } else {
        await createCategory({
          name,
          icon,
          colorToken,
          isArchived: false,
        });
      }
      handleReset();
    } catch (submitError) {
      showAlert(
        'Save failed',
        submitError instanceof Error ? submitError.message : 'Unable to save category.',
      );
    }
  };

  const handleEdit = (category: (typeof categories)[number]) => {
    setEditingId(category.id);
    setName(category.name);
    const resolvedIcon = resolveCategoryIcon(category.icon) as IconName;
    setIcon(iconOptions.includes(resolvedIcon) ? resolvedIcon : iconOptions[0]);
    const nextToken = category.colorToken as CategoryColorToken | undefined;
    setColorToken(nextToken && colorOptions.includes(nextToken) ? nextToken : colorOptions[0]);
  };

  const handleArchive = (categoryId: string) => {
    showAlert('Archive category', 'This category will be hidden from pickers.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'destructive',
        onPress: () => archiveCategory(categoryId),
      },
    ]);
  };

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const current = [...activeCategories];
    const index = current.findIndex((category) => category.id === categoryId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= current.length) return;
    const next = [...current];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    await reorderCategories(next.map((category) => category.id));
  };

  const isSubmitDisabled = name.trim().length === 0;

  return (
    <ScreenLayout
      gap={20}
      header={(
        <Text color="$textPrimary" fontSize={24} fontWeight="700">
          Categories
        </Text>
      )}
    >
      {alertDialog}
      <AppCard elevated>
        <YStack gap={16}>
          <Text color="$textPrimary" fontSize={16} fontWeight="600">
            {editingId ? 'Edit category' : 'Create category'}
          </Text>
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Category name"
          />

          <YStack gap={8}>
            <Text color="$textSecondary" fontSize={12} fontWeight="600">
              Icon
            </Text>
            <XStack flexWrap="wrap" gap={10}>
              {iconOptions.map((option) => (
                <IconOption
                  key={option}
                  selected={option === icon}
                  onPress={() => {
                    triggerHaptic('selection');
                    setIcon(option);
                  }}
                >
                  <Ionicons
                    name={option}
                    size={20}
                    color={theme.textPrimary?.val}
                  />
                </IconOption>
              ))}
            </XStack>
          </YStack>

          <YStack gap={8}>
            <Text color="$textSecondary" fontSize={12} fontWeight="600">
              Color
            </Text>
            <XStack gap={10} flexWrap="wrap">
              {colorOptions.map((option) => (
                <ColorOption
                  key={option}
                  selected={option === colorToken}
                  backgroundColor={
                    categoryColors[option] as ComponentProps<typeof XStack>['backgroundColor']
                  }
                  onPress={() => {
                    triggerHaptic('selection');
                    setColorToken(option);
                  }}
                />
              ))}
            </XStack>
          </YStack>

          <XStack gap={12}>
            <AppButton
              label={editingId ? 'Save changes' : 'Add category'}
              tone="primary"
              haptic="success"
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
            />
            {editingId ? (
              <AppButton
                label="Cancel"
                tone="ghost"
                onPress={handleReset}
              />
            ) : null}
          </XStack>
        </YStack>
      </AppCard>

      <XStack alignItems="center" justifyContent="space-between">
        <Text color="$textSecondary" fontSize={12} fontWeight="600">
          ACTIVE CATEGORIES
        </Text>
        <XStack alignItems="center" gap={8}>
          <Text color="$textSecondary" fontSize={12}>
            Show archived
          </Text>
          <TamaguiSwitch
            id="show-archived-switch"
            size="$3"
            checked={showArchived}
            onCheckedChange={(value: boolean) => {
              triggerHaptic('selection');
              setShowArchived(value);
            }}
            backgroundColor={showArchived ? '$primary' : '$border'}
          >
            <TamaguiSwitch.Thumb backgroundColor="white" />
          </TamaguiSwitch>
        </XStack>
      </XStack>

      {error ? (
        <AppCard>
          <Text color="$danger" fontSize={12}>
            {error}
          </Text>
        </AppCard>
      ) : null}

      <YStack gap={12}>
        {activeCategories.map((category, index) => {
          const iconName = resolveCategoryIcon(category.icon) as IconName;
          const iconColor =
            (category.colorToken
              ? categoryColors[category.colorToken as CategoryColorToken]
              : theme.primary?.val) ?? '#6366F1';
          return (
            <AppCard key={category.id} elevated>
              <XStack alignItems="center" justifyContent="space-between" gap={12}>
                <XStack alignItems="center" gap={12} flex={1}>
                  <YStack
                    width={40}
                    height={40}
                    borderRadius={12}
                    alignItems="center"
                    justifyContent="center"
                    backgroundColor={resolveTint(iconColor ?? '#6366F1')}
                  >
                    <Ionicons name={iconName} size={20} color={iconColor} />
                  </YStack>
                  <YStack gap={4} flex={1}>
                    <Text color="$textPrimary" fontSize={15} fontWeight="600">
                      {category.name}
                    </Text>
                    <Text color="$textSecondary" fontSize={12}>
                      {category.colorToken ?? 'custom'}
                    </Text>
                  </YStack>
                </XStack>

                <XStack alignItems="center" gap={6}>
                  <AppIconButton
                    tone="surface"
                    icon={<Ionicons name="chevron-up" size={16} color={theme.textSecondary?.val} />}
                    onPress={() => moveCategory(category.id, 'up')}
                    disabled={index === 0 || isLoading}
                  />
                  <AppIconButton
                    tone="surface"
                    icon={
                      <Ionicons name="chevron-down" size={16} color={theme.textSecondary?.val} />
                    }
                    onPress={() => moveCategory(category.id, 'down')}
                    disabled={index === activeCategories.length - 1 || isLoading}
                  />
                  <AppIconButton
                    tone="surface"
                    icon={<Ionicons name="create-outline" size={16} color={theme.textSecondary?.val} />}
                    onPress={() => handleEdit(category)}
                    disabled={isLoading}
                  />
                  <AppIconButton
                    tone="surface"
                    icon={<Ionicons name="archive-outline" size={16} color={theme.danger?.val} />}
                    onPress={() => handleArchive(category.id)}
                    haptic="warning"
                    disabled={isLoading}
                  />
                </XStack>
              </XStack>
            </AppCard>
          );
        })}
      </YStack>

      {showArchived && archivedCategories.length > 0 ? (
        <YStack gap={12}>
          <Text color="$textSecondary" fontSize={12} fontWeight="600">
            ARCHIVED
          </Text>
          {archivedCategories.map((category) => {
            const iconName = resolveCategoryIcon(category.icon) as IconName;
            const iconColor =
              (category.colorToken
                ? categoryColors[category.colorToken as CategoryColorToken]
                : theme.primary?.val) ?? '#6366F1';
            return (
              <AppCard key={category.id}>
                <XStack alignItems="center" justifyContent="space-between" gap={12}>
                  <XStack alignItems="center" gap={12} flex={1}>
                    <YStack
                      width={36}
                      height={36}
                      borderRadius={12}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={resolveTint(iconColor ?? '#6366F1')}
                    >
                      <Ionicons name={iconName} size={18} color={iconColor} />
                    </YStack>
                    <YStack gap={4} flex={1}>
                      <Text color="$textPrimary" fontSize={14} fontWeight="600">
                        {category.name}
                      </Text>
                      <Text color="$textSecondary" fontSize={12}>
                        Archived
                      </Text>
                    </YStack>
                  </XStack>
                  <AppButton
                    label="Restore"
                    tone="secondary"
                    onPress={() => restoreCategory(category.id)}
                  />
                </XStack>
              </AppCard>
            );
          })}
        </YStack>
      ) : null}
    </ScreenLayout>
  );
}
