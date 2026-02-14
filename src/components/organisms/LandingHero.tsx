import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, styled, useTheme } from 'tamagui';
import { AppButton } from '../atoms';

const HeroCard = styled(YStack, {
  height: 440,
  borderRadius: 28,
  backgroundColor: '$primary',
  padding: 24,
  overflow: 'hidden',
  justifyContent: 'space-between',
  animation: 'medium',
  enterStyle: { opacity: 0, y: 12 },
  shadowColor: '#0B1220',
  shadowOpacity: 0.35,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 14 },
  elevation: 12,
});

const HeroGlow = styled(YStack, {
  position: 'absolute',
  width: 260,
  height: 260,
  borderRadius: 9999,
  backgroundColor: 'rgba(255,255,255,0.18)',
  top: -120,
  right: -80,
});

const HeroRing = styled(YStack, {
  position: 'absolute',
  width: 180,
  height: 180,
  borderRadius: 9999,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.22)',
  bottom: -40,
  left: -40,
});

interface LandingHeroProps {
  onStart: () => void;
}

export function LandingHero({ onStart }: LandingHeroProps) {
  const theme = useTheme();

  return (
    <HeroCard>
      <HeroGlow />
      <HeroRing />

      <XStack alignItems="center" gap={10}>
        <YStack
          width={48}
          height={48}
          borderRadius={16}
          backgroundColor="rgba(255,255,255,0.2)"
          alignItems="center"
          justifyContent="center"
        >
          <Ionicons name="wallet" size={24} color={theme.textInverse?.val} />
        </YStack>
        <YStack gap={2}>
          <Text color="$textInverse" fontSize={12} opacity={0.8}>
            Expense Tracker
          </Text>
          <Text color="$textInverse" fontSize={16} fontWeight="600">
            Smart Budget Flow
          </Text>
        </YStack>
      </XStack>

      <YStack gap={16}>
        <Text color="$textInverse" fontSize={28} fontWeight="700" lineHeight={36}>
          Own your spending,{'\n'}
          <Text color="$primaryLight">one smart habit</Text> at a time.
        </Text>
        <Text color="$textInverse" fontSize={14} opacity={0.8} lineHeight={20}>
          Track daily expenses, set gentle limits, and see your progress with
          clean, calming insights.
        </Text>
        <AppButton
          label="Start now"
          tone="soft"
          icon={<Ionicons name="arrow-forward" size={18} color={theme.primary?.val} />}
          onPress={onStart}
        />
      </YStack>
    </HeroCard>
  );
}
