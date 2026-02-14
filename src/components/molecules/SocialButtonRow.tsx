import { Ionicons } from '@expo/vector-icons';
import { XStack, styled, useTheme } from 'tamagui';

type IconName = keyof typeof Ionicons.glyphMap;

const SocialButton = styled(XStack, {
  width: 78,
  height: 44,
  borderRadius: 14,
  backgroundColor: '$surface',
  borderWidth: 1,
  borderColor: '$border',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fast',
  pressStyle: { scale: 0.97, backgroundColor: '$surfaceHover' },
});

const socialIcons: IconName[] = ['logo-facebook', 'logo-google', 'logo-apple'];

interface SocialButtonRowProps {
  onFacebookPress?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

export function SocialButtonRow({
  onFacebookPress,
  onGooglePress,
  onApplePress,
}: SocialButtonRowProps) {
  const theme = useTheme();

  const handlers = {
    'logo-facebook': onFacebookPress,
    'logo-google': onGooglePress,
    'logo-apple': onApplePress,
  };

  return (
    <XStack gap={12} justifyContent="center">
      {socialIcons.map((name) => (
        <SocialButton key={name} onPress={handlers[name]}>
          <Ionicons name={name} size={18} color={theme.textPrimary?.val} />
        </SocialButton>
      ))}
    </XStack>
  );
}
