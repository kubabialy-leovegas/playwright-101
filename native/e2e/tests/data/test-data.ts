export const users = {
    valid: { email: "qa@example.com", password: "password123" },
} as const;

/** The 5 products the backend always has (see backend/.../Catalog.kt). */
export const products = {
    mouse: { id: 1, name: "Wireless Mouse", category: "electronics", price: "€19.99" },
    keyboard: { id: 2, name: "Mechanical Keyboard", category: "electronics", price: "€89.00" },
    mug: { id: 3, name: "Coffee Mug", category: "home", price: "€7.50" },
    lamp: { id: 4, name: "Desk Lamp", category: "home", price: "€24.00" },
    shoes: { id: 5, name: "Running Shoes", category: "sports", price: "€64.99" },
} as const;
