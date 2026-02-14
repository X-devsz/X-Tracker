/**
 * Home Screen - Dashboard
 *
 * Overview with monthly summary and recent expenses.
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import {
  AppCard,
  AppIconButton,
  EmptyState,
  MonthlySummaryCard,
  QuickAddFAB,
  ScreenContainer,
} from '../../components';

const quickStats = [
  {
    id: 'transactions',
    label: 'Transactions',
    value: '0',
    icon: 'arrow-down',
    backgroundColor: '$successLight',
    iconColor: 'success',
  },
  {
    id: 'categories',
    label: 'Categories',
    value: '8',
    icon: 'layers',
    backgroundColor: '$warningLight',
    iconColor: 'warning',
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScreenContainer gap={20}>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <Text color="$textSecondary" fontSize={13} fontWeight="500">
              Welcome back
            </Text>
            <Text color="$textPrimary" fontSize={24} fontWeight="700">
              Dashboard
            </Text>
          </YStack>
          <AppIconButton
            tone="soft"
            icon={<Ionicons name="person" size={20} color={theme.primary?.val} />}
          />
        </XStack>

        <MonthlySummaryCard
          amount="0.00"
          changePercent={0}
          changeLabel="no expenses yet"
        />

        <XStack gap={12}>
          {quickStats.map((stat) => {
            const iconColor =
              stat.iconColor === 'success' ? theme.success?.val : theme.warning?.val;

            return (
              <AppCard
                key={stat.id}
                elevated
                flex={1}
                padding={16}
                gap={6}
              >
                <XStack
                  width={36}
                  height={36}
                  borderRadius={12}
                  backgroundColor={stat.backgroundColor}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Ionicons
                    name={stat.icon as keyof typeof Ionicons.glyphMap}
                    size={18}
                    color={iconColor}
                  />
                </XStack>
                <Text color="$textSecondary" fontSize={11}>
                  {stat.label}
                </Text>
                <Text color="$textPrimary" fontSize={20} fontWeight="700">
                  {stat.value}
                </Text>
              </AppCard>
            );
          })}
        </XStack>

        <YStack gap={12}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text color="$textPrimary" fontSize={17} fontWeight="600">
              Recent Expenses
            </Text>
            <Text color="$primary" fontSize={13} fontWeight="500">
              See All
            </Text>
          </XStack>

          <EmptyState
            icon={
              <YStack
                width={80}
                height={80}
                borderRadius={9999}
                backgroundColor="$primaryLight"
                alignItems="center"
                justifyContent="center"
              >
                <Ionicons
                  name="receipt-outline"
                  size={36}
                  color={theme.primary?.val}
                />
              </YStack>
            }
            title="No expenses yet"
            description="Tap the button below to add your first expense."
            actionLabel="Add expense"
            onAction={() => router.push('/expense/add')}
          />
        </YStack>
      </ScreenContainer>

      <QuickAddFAB onPress={() => router.push('/expense/add')} />
    </YStack>
  );
}
