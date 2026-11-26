import AppScreen from "#screen_objects/app-screen.ts";
import { locatorStrategy, scrollUntilDisplayed, swipeLeft, waitUntilGone } from "#helpers/utils.ts";

const SELECTORS = {
    SCREEN: "cart-screen",
    BACK_BUTTON: "back-button",
    EMPTY_CART: "empty-cart",
    CART_TOTAL: "cart-total",
    CHECKOUT_BUTTON: "checkout-button",
    CLEAR_CART_BUTTON: "clear-cart-button",
    CART_ERROR: "cart-error",
} as const;

class CartScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    get backButton() {return $(locatorStrategy(SELECTORS.BACK_BUTTON));}
    get emptyCart() {return $(locatorStrategy(SELECTORS.EMPTY_CART));}
    get total() {return $(locatorStrategy(SELECTORS.CART_TOTAL));}
    get checkoutButton() {return $(locatorStrategy(SELECTORS.CHECKOUT_BUTTON));}
    get clearCartButton() {return $(locatorStrategy(SELECTORS.CLEAR_CART_BUTTON));}
    get error() {return $(locatorStrategy(SELECTORS.CART_ERROR));}

    item(productId: number) {return $(locatorStrategy(`cart-item-${productId}`));}
    itemName(productId: number) {return $(locatorStrategy(`cart-item-name-${productId}`));}
    itemQuantity(productId: number) {return $(locatorStrategy(`cart-item-qty-${productId}`));}
    increaseButton(productId: number) {return $(locatorStrategy(`cart-item-increase-${productId}`));}

    async removeBySwipe(productId: number): Promise<void> {
        await swipeLeft(this.item(productId));
        await waitUntilGone(`cart-item-${productId}`);
    }

    async checkout(): Promise<void> {
        await scrollUntilDisplayed(this.checkoutButton);
        await this.checkoutButton.click();
    }
}
export default new CartScreen();
