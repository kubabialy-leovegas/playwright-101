import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { api, ApiError } from '../api';
import { Button, Header, LinkButton, colors, shared } from '../ui';

type Props = {
  onLoggedIn: (token: string, email: string) => void;
  onContact: () => void;
};

export function LoginScreen({ onLoggedIn, onContact }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setError(null);
    setLoading(true);
    try {
      const session = await api.login(email, password);
      onLoggedIn(session.token, session.email);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={shared.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header testID="login-screen" title="Demo Shop" />
      <View style={shared.content}>
        <Text style={shared.muted}>Log in with qa@example.com / password123</Text>

        <Text style={shared.label}>Email</Text>
        <TextInput
          testID="email-input"
          accessibilityLabel="Email"
          style={shared.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="none"
          autoComplete="off"
        />

        <Text style={shared.label}>Password</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TextInput
            testID="password-input"
            accessibilityLabel="Password"
            style={[shared.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="none"
            autoComplete="off"
          />
          <Pressable
            testID="password-toggle"
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={8}
          >
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{showPassword ? 'Hide' : 'Show'}</Text>
          </Pressable>
        </View>

        {error && (
          <Text testID="login-error" style={shared.error}>
            {error}
          </Text>
        )}

        <Button testID="login-button" title="Log in" onPress={login} disabled={loading} />
        {loading && <ActivityIndicator testID="login-loading" />}

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <LinkButton testID="contact-link" title="Need help? Contact us" onPress={onContact} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
