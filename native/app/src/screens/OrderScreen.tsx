import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { api, ApiError, Order } from '../api';
import { Button, Header, colors, shared } from '../ui';

type Props = { token: string; orderId: number; onBackToShop: () => void };

/**
 * The payment provider answers ~1.5 s after the order is placed (see the backend),
 * so the order starts as PENDING and we poll until it is CONFIRMED or REJECTED.
 */
export function OrderScreen({ token, orderId, onBackToShop }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const next = await api.order(token, orderId);
        if (cancelled) return;
        setOrder(next);
        if (next.status === 'PENDING') timer = setTimeout(poll, 500);
      } catch (e) {
        if (!cancelled) setError(e instanceof ApiError ? e.message : 'Could not load the order');
      }
    };
    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [token, orderId]);

  const statusColor =
    order?.status === 'CONFIRMED' ? colors.success : order?.status === 'REJECTED' ? colors.danger : colors.muted;

  return (
    <View style={shared.screen}>
      <Header testID="order-screen" title="Order" />
      <View style={shared.content}>
        <Text testID="order-id" style={styles.title}>
          Order #{orderId}
        </Text>
        {order === null && !error && <ActivityIndicator />}
        {order && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text testID="order-status" style={[styles.status, { color: statusColor }]}>
                {order.status}
              </Text>
              {order.status === 'PENDING' && <ActivityIndicator testID="order-pending-spinner" />}
            </View>
            {order.reason && (
              <Text testID="order-reason" style={shared.error}>
                {order.reason}
              </Text>
            )}
            <Text testID="order-total" style={shared.muted}>
              Total €{order.total.toFixed(2)}
            </Text>
          </>
        )}
        {error && (
          <Text testID="order-error" style={shared.error}>
            {error}
          </Text>
        )}
        <Button testID="back-to-shop-button" title="Back to shop" variant="secondary" onPress={onBackToShop} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  status: { fontSize: 20, fontWeight: '700' },
});
