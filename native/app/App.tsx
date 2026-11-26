import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, Linking } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { api } from './src/api';
import { CartScreen } from './src/screens/CartScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { OrderScreen } from './src/screens/OrderScreen';
import { ShopScreen } from './src/screens/ShopScreen';
import { colors } from './src/ui';

type Route = { name: 'login' } | { name: 'shop' } | { name: 'cart' } | { name: 'contact' } | { name: 'order'; orderId: number };
type Session = { token: string; email: string };

// Screens you can open with a deep link, e.g. demoshop://cart
const LINKABLE = ['shop', 'cart', 'contact'] as const;

/**
 * Turns a deep link into a route.
 *   demoshop://cart                      -> the cart
 *   demoshop://session/<token>?to=cart   -> TEST ONLY: use this session, then open the cart
 * The session link lets a test log in through the API and skip the login screen,
 * like the backend's /api/test endpoints. A real app would only ship it in test builds.
 */
function parseLink(url: string): { route?: Route; token?: string } {
  const match = url.match(/^demoshop:\/\/([^?]*)\??(.*)$/);
  if (!match) return {};
  const [first, second] = match[1].split('/').filter(Boolean);
  const to = new URLSearchParams(match[2]).get('to') ?? 'shop';
  const target = (LINKABLE as readonly string[]).includes(to) ? ({ name: to } as Route) : { name: 'shop' as const };
  if (first === 'session' && second) return { token: second, route: target };
  if ((LINKABLE as readonly string[]).includes(first)) return { route: { name: first } as Route };
  return {};
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [route, setRoute] = useState<Route>({ name: 'login' });
  const [cartCount, setCartCount] = useState(0);
  // Where to go after login, when a deep link needed a session we did not have yet.
  const pending = useRef<Route | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const startSession = useCallback(async (next: Session, target: Route) => {
    setSession(next);
    const cart = await api.cart(next.token).catch(() => null);
    setCartCount(cart?.count ?? 0);
    setRoute(target);
  }, []);

  const handleLink = useCallback(
    async (url: string | null | undefined) => {
      if (!url) return;
      const { route: target, token } = parseLink(url);
      if (!target) return;
      if (token) {
        const me = await api.me(token).catch(() => null);
        if (me) await startSession({ token, email: me.email }, target);
        return;
      }
      if (sessionRef.current || target.name === 'contact') setRoute(target);
      else pending.current = target;
    },
    [startSession],
  );

  useEffect(() => {
    Linking.getInitialURL().then(handleLink);
    const subscription = Linking.addEventListener('url', ({ url }) => handleLink(url));
    return () => subscription.remove();
  }, [handleLink]);

  const home: Route = session ? { name: 'shop' } : { name: 'login' };

  // Android's back button / gesture. Returning false lets Android close the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (route.name === 'login' || route.name === 'shop') return false;
      setRoute(home);
      return true;
    });
    return () => subscription.remove();
  }, [route, home]);

  async function logout() {
    if (session) await api.logout(session.token).catch(() => undefined);
    setSession(null);
    setCartCount(0);
    setRoute({ name: 'login' });
  }

  function renderScreen() {
    switch (route.name) {
      case 'login':
        return (
          <LoginScreen
            onLoggedIn={(token, email) => {
              const target = pending.current ?? { name: 'shop' };
              pending.current = null;
              startSession({ token, email }, target);
            }}
            onContact={() => setRoute({ name: 'contact' })}
          />
        );
      case 'contact':
        return <ContactScreen onBack={() => setRoute(home)} backLabel={session ? 'Shop' : 'Login'} />;
    }
    if (!session) return null;
    switch (route.name) {
      case 'shop':
        return (
          <ShopScreen
            token={session.token}
            email={session.email}
            cartCount={cartCount}
            onCartChanged={setCartCount}
            onOpenCart={() => setRoute({ name: 'cart' })}
            onOpenContact={() => setRoute({ name: 'contact' })}
            onLogout={logout}
          />
        );
      case 'cart':
        return (
          <CartScreen
            token={session.token}
            onCartChanged={setCartCount}
            onBack={() => setRoute({ name: 'shop' })}
            onOrderPlaced={(orderId) => setRoute({ name: 'order', orderId })}
          />
        );
      case 'order':
        return <OrderScreen token={session.token} orderId={route.orderId} onBackToShop={() => setRoute({ name: 'shop' })} />;
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.card }}>
        <StatusBar style="dark" />
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
