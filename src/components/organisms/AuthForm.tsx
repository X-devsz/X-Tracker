import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { XStack, YStack } from 'tamagui';
import { AppButton, AppCheckbox, TextLink } from '@/components/atoms';
import { AuthField, AuthFooter, OrDivider, SocialButtonRow } from '@/components/molecules';

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
  const isLogin = variant === 'login';
  const [rememberMe, setRememberMe] = useState(true);

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
          <AppCheckbox
            id="remember-me"
            label="Remember me"
            checked={rememberMe}
            onCheckedChange={(next) => setRememberMe(next === true)}
          />
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
