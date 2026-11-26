import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, PanResponder, ScrollView, StyleSheet, Text, View } from 'react-native';
import { api, ApiError, Cart, CartItem } from '../api';
import { Button, Header, LinkButton, colors, shared } from '../ui';

type Props = {
  token: string;
  onCartChanged: (count: number) => void;
  onBack: () => void;
  onOrderPlaced: (orderId: number) => void;
};

export function CartScreen({ token, onCartChanged, onBack, onOrderPlaced }: Props) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    api.cart(token).then(update, showError);
  }, [token]);

  function update(next: Cart) {
    setCart(next);
    onCartChanged(next.count);
  }

  function showError(e: unknown) {
    setError(e instanceof ApiError ? e.message : 'Something went wrong');
  }

  async function run(action: () => Promise<Cart>) {
    setError(null);
    try {
      update(await action());
    } catch (e) {
      showError(e);
    }
  }

  function confirmClear() {
    Alert.alert('Empty the cart?', 'All products will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Empty cart', style: 'destructive', onPress: () => run(() => api.clearCart(token)) },
    ]);
  }

  async function checkout() {
    setError(null);
    setPlacing(true);
    try {
      const order = await api.placeOrder(token);
      onCartChanged(0);
      onOrderPlaced(order.id);
    } catch (e) {
      showError(e);
      setPlacing(false);
    }
  }

  return (
    <View style={shared.screen}>
      <Header testID="cart-screen" title="Cart" left={<LinkButton testID="back-button" title="‹ Shop" onPress={onBack} />} />

      {cart === null && !error && <ActivityIndicator testID="cart-loading" style={{ marginTop: 32 }} />}

      {cart !== null && cart.items.length === 0 && (
        <Text testID="empty-cart" style={[shared.muted, { padding: 24, textAlign: 'center' }]}>
          Your cart is empty
        </Text>
      )}

      {cart !== null && cart.items.length > 0 && (
        <ScrollView contentContainerStyle={shared.content}>
          <Text style={shared.muted}>Swipe a product to the left to remove it.</Text>
          {cart.items.map((item) => (
            <SwipeableRow key={item.productId} item={item} onRemove={() => run(() => api.removeFromCart(token, item.productId))}>
              <View style={{ flex: 1 }}>
                <Text testID={`cart-item-name-${item.productId}`} style={styles.name}>
                  {item.name}
                </Text>
                <Text testID={`cart-item-price-${item.productId}`} style={shared.muted}>
                  €{item.price.toFixed(2)} each
                </Text>
              </View>
              <Text testID={`cart-item-qty-${item.productId}`} style={styles.qty}>
                × {item.quantity}
              </Text>
              <LinkButton
                testID={`cart-item-increase-${item.productId}`}
                title="+1"
                onPress={() => run(() => api.addToCart(token, item.productId))}
              />
            </SwipeableRow>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.name}>Total</Text>
            <Text testID="cart-total" style={styles.name}>
              €{cart.total.toFixed(2)}
            </Text>
          </View>

          <Button testID="checkout-button" title="Place order" onPress={checkout} disabled={placing} />
          <Button testID="clear-cart-button" title="Empty cart" variant="secondary" onPress={confirmClear} />
        </ScrollView>
      )}

      {error && (
        <Text testID="cart-error" style={[shared.error, { padding: 16 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const SWIPE_TO_REMOVE = -120;

/** A row you can drag to the left; let go past 120 points and it removes the product. */
function SwipeableRow({ item, onRemove, children }: { item: CartItem; onRemove: () => void; children: React.ReactNode }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const responder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 10 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => translateX.setValue(Math.min(0, g.dx)),
      onPanResponderRelease: (_, g) => {
        if (g.dx < SWIPE_TO_REMOVE) {
          Animated.timing(translateX, { toValue: -500, duration: 150, useNativeDriver: true }).start(onRemove);
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
        }
      },
      onPanResponderTerminate: () => Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start(),
    }),
  ).current;

  return (
    <View style={styles.rowWrapper}>
      <View style={styles.removeBehind}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>Remove</Text>
      </View>
      <Animated.View
        testID={`cart-item-${item.productId}`}
        style={[styles.row, { transform: [{ translateX }] }]}
        {...responder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowWrapper: { borderRadius: 12, overflow: 'hidden' },
  removeBehind: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.danger,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  name: { fontSize: 17, fontWeight: '700', color: colors.text },
  qty: { fontSize: 16, color: colors.text },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
});
