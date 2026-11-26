import { ReactNode } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

export const colors = {
  primary: '#1f6feb',
  danger: '#cf222e',
  success: '#1a7f37',
  text: '#1f2328',
  muted: '#59636e',
  border: '#d1d9e0',
  background: '#f6f8fa',
  card: '#ffffff',
};

type ButtonProps = {
  testID: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

/**
 * The testID goes on the Pressable, not on the Text inside it.
 * On iOS a Pressable is one accessibility element, so XCUITest cannot see
 * test IDs on its children; on Android it can. Keep IDs on the outer element.
 */
export function Button({ testID, title, onPress, disabled, variant = 'primary' }: ButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'danger' && styles.danger,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

/**
 * The screen's testID (e.g. "shop-screen") sits on the visible title, not on the screen's root view.
 * On iOS a big container view often reports visible="false" even when it is on screen,
 * so tests that wait for "the screen" wait for its title instead.
 * Tapping the title closes the keyboard; tests use that on iOS, where not every keyboard has a "hide" key.
 */
export function Header({ testID, title, left, right }: { testID: string; title: string; left?: ReactNode; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerSide}>{left}</View>
      <Pressable testID={testID} accessibilityRole="header" accessibilityLabel={title} onPress={Keyboard.dismiss}>
        <Text style={styles.headerTitle}>{title}</Text>
      </Pressable>
      <View style={[styles.headerSide, styles.headerRight]}>{right}</View>
    </View>
  );
}

export function LinkButton({ testID, title, onPress }: { testID: string; title: string; onPress: () => void }) {
  return (
    <Pressable testID={testID} accessibilityRole="button" accessibilityLabel={title} onPress={onPress} hitSlop={8}>
      <Text style={styles.link}>{title}</Text>
    </Pressable>
  );
}

export const shared = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 12 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.text,
  },
  error: { color: colors.danger, fontSize: 14 },
  muted: { color: colors.muted, fontSize: 14 },
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondary: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: colors.danger },
  disabled: { opacity: 0.4 },
  pressed: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: { color: colors.text },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerRight: { justifyContent: 'flex-end' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  link: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});
