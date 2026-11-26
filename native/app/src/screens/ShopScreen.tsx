import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { api, ApiError, Product } from '../api';
import { Button, Header, LinkButton, colors, shared } from '../ui';

const CATEGORIES = ['all', 'electronics', 'home', 'sports'] as const;
const ICONS: Record<string, string> = { electronics: '🖱️', home: '🏠', sports: '👟' };

type Props = {
  token: string;
  email: string;
  cartCount: number;
  onCartChanged: (count: number) => void;
  onOpenCart: () => void;
  onOpenContact: () => void;
  onLogout: () => void;
};

export function ShopScreen({ token, email, cartCount, onCartChanged, onOpenCart, onOpenContact, onLogout }: Props) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    api.products().then(setProducts, (e) => setLoadError(e instanceof ApiError ? e.message : 'Could not load products'));
    return () => clearTimeout(toastTimer.current);
  }, []);

  const visible = useMemo(
    () =>
      (products ?? []).filter(
        (p) =>
          (category === 'all' || p.category === category) && p.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [products, search, category],
  );

  async function addToCart(product: Product) {
    try {
      const cart = await api.addToCart(token, product.id);
      onCartChanged(cart.count);
      showToast(`${product.name} added to cart`);
    } catch (e) {
      showToast(e instanceof ApiError ? e.message : 'Could not add to cart');
    }
  }

  // The toast disappears by itself after 2 seconds, a classic thing to wait for in a test.
  function showToast(message: string) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  // A native alert: XCUITest and UiAutomator2 see it as a system dialog, not as part of our screen.
  function confirmLogout() {
    Alert.alert('Log out?', 'Your cart will be emptied.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: onLogout },
    ]);
  }

  return (
    <View style={shared.screen}>
      <Header testID="shop-screen"
        title="Shop"
        left={<LinkButton testID="logout-button" title="Log out" onPress={confirmLogout} />}
        right={
          <>
            <LinkButton testID="nav-contact" title="Help" onPress={onOpenContact} />
            <LinkButton testID="nav-cart" title="Cart" onPress={onOpenCart} />
            <Text testID="cart-count" style={styles.badge}>
              {cartCount}
            </Text>
          </>
        }
      />

      <View style={styles.filters}>
        <Text testID="user-email" style={shared.muted}>
          Logged in as {email}
        </Text>
        <TextInput
          testID="search-input"
          accessibilityLabel="Search products"
          style={shared.input}
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
        />
        <View style={styles.chips}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              testID={`category-${c}`}
              accessibilityRole="button"
              accessibilityLabel={c}
              accessibilityState={{ selected: category === c }}
              onPress={() => setCategory(c)}
              style={[styles.chip, category === c && styles.chipSelected]}
            >
              <Text style={[styles.chipText, category === c && styles.chipTextSelected]}>{c}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {products === null && !loadError && <ActivityIndicator testID="products-loading" size="large" style={{ marginTop: 32 }} />}
      {loadError && (
        <Text testID="products-error" style={[shared.error, { padding: 16 }]}>
          {loadError}
        </Text>
      )}

      {products !== null && (
        <FlatList
          testID="product-list"
          data={visible}
          keyExtractor={(p) => String(p.id)}
          contentContainerStyle={{ padding: 16, gap: 16 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text testID="no-results" style={[shared.muted, { textAlign: 'center' }]}>
              No products match your search
            </Text>
          }
          ListFooterComponent={
            visible.length > 0 ? (
              <Text testID="catalog-end" style={[shared.muted, { textAlign: 'center' }]}>
                You have seen all {visible.length} products
              </Text>
            ) : undefined
          }
          renderItem={({ item }) => (
            // A plain View (not a Pressable), so XCUITest can still see the IDs inside it.
            <View testID={`product-${item.id}`} style={styles.card}>
              <Text style={styles.icon}>{ICONS[item.category] ?? '📦'}</Text>
              <Text testID={`product-name-${item.id}`} style={styles.name}>
                {item.name}
              </Text>
              <Text testID={`product-category-${item.id}`} style={shared.muted}>
                {item.category}
              </Text>
              <Text testID={`product-price-${item.id}`} style={styles.price}>
                €{item.price.toFixed(2)}
              </Text>
              <Button testID={`add-to-cart-${item.id}`} title="Add to cart" onPress={() => addToCart(item)} />
            </View>
          )}
        />
      )}

      {toast && (
        <View testID="toast" style={styles.toast} pointerEvents="none">
          <Text testID="toast-message" style={styles.toastText}>
            {toast}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 24,
    textAlign: 'center',
    backgroundColor: colors.primary,
    color: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontWeight: '700',
  },
  filters: { padding: 16, gap: 10, backgroundColor: colors.card },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6 },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text },
  chipTextSelected: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, gap: 6, borderWidth: 1, borderColor: colors.border },
  icon: { fontSize: 64, textAlign: 'center', paddingVertical: 12 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  price: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 6 },
  toast: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    backgroundColor: colors.text,
    borderRadius: 8,
    padding: 14,
  },
  toastText: { color: '#fff', textAlign: 'center', fontSize: 15 },
});
