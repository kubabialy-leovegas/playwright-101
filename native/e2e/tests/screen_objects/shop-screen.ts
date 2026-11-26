import AppScreen from "#screen_objects/app-screen.ts";
import { hideKeyboard, locatorStrategy, scrollUntilDisplayed } from "#helpers/utils.ts";

const SELECTORS = {
    SCREEN: "shop-screen",
    USER_EMAIL: "user-email",
    SEARCH_INPUT: "search-input",
    PRODUCTS_LOADING: "products-loading",
    PRODUCT_LIST: "product-list",
    NO_RESULTS: "no-results",
    CATALOG_END: "catalog-end",
    CART_COUNT: "cart-count",
    NAV_CART: "nav-cart",
    NAV_CONTACT: "nav-contact",
    LOGOUT_BUTTON: "logout-button",
    TOAST_MESSAGE: "toast-message",
} as const;

class ShopScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    get userEmail() {return $(locatorStrategy(SELECTORS.USER_EMAIL));}
    get searchInput() {return $(locatorStrategy(SELECTORS.SEARCH_INPUT));}
    get productsLoading() {return $(locatorStrategy(SELECTORS.PRODUCTS_LOADING));}
    get productList() {return $(locatorStrategy(SELECTORS.PRODUCT_LIST));}
    get noResults() {return $(locatorStrategy(SELECTORS.NO_RESULTS));}
    get catalogEnd() {return $(locatorStrategy(SELECTORS.CATALOG_END));}
    get cartCount() {return $(locatorStrategy(SELECTORS.CART_COUNT));}
    get cartButton() {return $(locatorStrategy(SELECTORS.NAV_CART));}
    get contactButton() {return $(locatorStrategy(SELECTORS.NAV_CONTACT));}
    get logoutButton() {return $(locatorStrategy(SELECTORS.LOGOUT_BUTTON));}
    get toastMessage() {return $(locatorStrategy(SELECTORS.TOAST_MESSAGE));}

    category(name: "all" | "electronics" | "home" | "sports") {return $(locatorStrategy(`category-${name}`));}
    product(id: number) {return $(locatorStrategy(`product-${id}`));}
    productName(id: number) {return $(locatorStrategy(`product-name-${id}`));}
    productPrice(id: number) {return $(locatorStrategy(`product-price-${id}`));}
    addToCartButton(id: number) {return $(locatorStrategy(`add-to-cart-${id}`));}

    /** Waits until the slow product list has loaded. */
    async waitForProducts(): Promise<void> {
        await this.productList.waitForDisplayed();
    }

    async search(text: string): Promise<void> {
        await this.searchInput.setValue(text);
        await hideKeyboard();
    }

    async addToCart(id: number): Promise<void> {
        const button = this.addToCartButton(id);
        await scrollUntilDisplayed(button);
        await button.click();
    }
}
export default new ShopScreen();
