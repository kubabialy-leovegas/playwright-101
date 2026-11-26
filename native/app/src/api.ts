import { Platform } from 'react-native';

// The Kotlin backend from ../../backend runs on your machine at port 8080.
// The iOS simulator shares the Mac's network, so "localhost" works there.
// The Android emulator is its own device: 10.0.2.2 is its alias for the host machine.
export const API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

export type Product = { id: number; name: string; category: string; price: number };
export type CartItem = { productId: number; name: string; price: number; quantity: number };
export type Cart = { items: CartItem[]; count: number; total: number };
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';
export type Order = { id: number; total: number; status: OrderStatus; reason?: string };
export type ContactRequest = { name: string; topic: string; via: string; message: string; terms: boolean };
export type ContactResponse = { ticketId: number; name: string; via: string };

/** Thrown for any non-2xx answer; carries the backend's message and field errors. */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors: Record<string, string> = {},
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: { method?: string; token?: string; body?: unknown } = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the shop. Is the backend running?');
  }
  if (response.status === 204) return undefined as T;
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(response.status, json.error ?? `HTTP ${response.status}`, json.errors);
  return json as T;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; email: string }>('/api/login', { method: 'POST', body: { email, password } }),
  logout: (token: string) => request<void>('/api/logout', { method: 'POST', token }),
  me: (token: string) => request<{ email: string }>('/api/me', { token }),

  // The real backend answers in a few ms. We wait a bit on purpose, like a slow mobile
  // network, so tests have to wait for the list instead of assuming it is already there.
  products: async () => {
    await sleep(1200);
    return request<Product[]>('/api/products');
  },

  cart: (token: string) => request<Cart>('/api/cart', { token }),
  addToCart: (token: string, productId: number) =>
    request<Cart>('/api/cart', { method: 'POST', token, body: { productId, quantity: 1 } }),
  removeFromCart: (token: string, productId: number) =>
    request<Cart>(`/api/cart/${productId}`, { method: 'DELETE', token }),
  clearCart: (token: string) => request<Cart>('/api/cart', { method: 'DELETE', token }),

  placeOrder: (token: string) => request<Order>('/api/orders', { method: 'POST', token }),
  order: (token: string, id: number) => request<Order>(`/api/orders/${id}`, { token }),

  contact: (body: ContactRequest) => request<ContactResponse>('/api/contact', { method: 'POST', body }),
};
