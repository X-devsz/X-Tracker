import { Ionicons } from '@expo/vector-icons';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { AppButton, TextLink } from '../atoms';
import { AuthField, AuthFooter, OrDivider, SocialButtonRow } from '../molecules';

type AuthVariant = 'login' | 'signup';

interface AuthFormProps {
  variant: AuthVariant;
  onPrimaryPress?: () => void;
  onFooterPress?: () => void;
  onGooglePress?: () => void;
}

export function AuthForm({
  variant,
  onPrimaryPress,
  onFooterPress,
  onGooglePress,
}: AuthFormProps) {
  const theme = useTheme();
  const isLogin = variant === 'login';

  const fields = isLogin
    ? [
        {
          label: 'Email',
          placeholder: 'you@email.com',
          icon: 'mail-outline',
        },
        {
          label: 'Password',
          placeholder: '••••••••',
          icon: 'lock-closed-outline',
          secureTextEntry: true,
        },
      ]
    : [
        {
          label: 'Full name',
          placeholder: 'Your name',
          icon: 'person-outline',
        },
        {
          label: 'Email',
          placeholder: 'you@email.com',
          icon: 'mail-outline',
        },
        {
          label: 'Password',
          placeholder: 'Create a password',
          icon: 'lock-closed-outline',
          secureTextEntry: true,
        },
        {
          label: 'Confirm password',
          placeholder: 'Repeat password',
          icon: 'lock-closed-outline',
          secureTextEntry: true,
        },
      ];

  return (
    <YStack gap={18} animation="medium" enterStyle={{ opacity: 0, y: 10 }}>
      <SocialButtonRow onGooglePress={onGooglePress} />
      <OrDivider label={isLogin ? 'or login with' : 'or register with'} />

      <YStack gap={14}>
        {fields.map((field) => (
          <AuthField
            key={field.label}
            label={field.label}
            icon={field.icon as keyof typeof Ionicons.glyphMap}
            placeholder={field.placeholder}
            secureTextEntry={field.secureTextEntry}
          />
        ))}
      </YStack>

      {isLogin ? (
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" gap={8}>
            <YStack
              width={16}
              height={16}
              borderRadius={4}
              backgroundColor="$primary"
              alignItems="center"
              justifyContent="center"
            >
              <Ionicons name="checkmark" size={12} color={theme.textInverse?.val} />
            </YStack>
            <Text color="$textSecondary" fontSize={12}>
              Remember me
            </Text>
          </XStack>
          <TextLink fontSize={12}>Forgot password?</TextLink>
        </XStack>
      ) : null}

      <AppButton
        label={isLogin ? 'Login' : 'Register'}
        onPress={onPrimaryPress}
      />

      <AuthFooter
        hint={isLogin ? "Don't have an account?" : 'Already have an account?'}
        action={isLogin ? 'Sign Up' : 'Log In'}
        onPress={onFooterPress}
      />
    </YStack>
  );
}
