/*
 * Talks to the Demo Shop backend directly, like player-api.ts in lvuk-native-apps creates
 * players for the UI tests. Use it to prepare data fast, then test only the screen you care about.
 * Tests run on your machine, so the backend is at localhost:8080 for both platforms.
 */

export const API_URL = process.env.SHOP_API_URL ?? "http://localhost:8080";

async function call<T>(path: string, options: { method?: string; token?: string; body?: unknown } = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            "Content-Type": "application/json",
            ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    if (!response.ok) {
        throw new Error(`${options.method ?? "GET"} ${path} failed: ${response.status} ${await response.text()}`);
    }
    return (response.status === 204 ? undefined : await response.json()) as T;
}

export async function isBackendUp(): Promise<boolean> {
    return call("/api/health").then(() => true, () => false);
}

/** Logs in and returns the session token. Every login is a new session with an empty cart. */
export async function login(email: string, password: string): Promise<string> {
    const { token } = await call<{ token: string }>("/api/login", { method: "POST", body: { email, password } });
    return token;
}

export async function addToCart(token: string, productId: number, quantity = 1): Promise<void> {
    await call("/api/cart", { method: "POST", token, body: { productId, quantity } });
}

export async function getCart(token: string): Promise<{ count: number; total: number }> {
    return call("/api/cart", { token });
}

/** Test-only endpoint: decide how the fake payment provider answers for this session. */
export async function setPaymentProvider(token: string, result: "APPROVE" | "DECLINE", delayMs?: number): Promise<void> {
    await call("/api/test/payment-provider", { method: "PUT", token, body: { result, delayMs } });
}
