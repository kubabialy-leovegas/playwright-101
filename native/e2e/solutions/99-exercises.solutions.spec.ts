/**
 * Solutions for tests/specs/99-exercises.spec.ts (for the trainer).
 * They live outside tests/specs, so a normal run skips them.
 * Run them with: npm run test:ios:solutions  (or test:android:solutions)
 */
import CartScreen from "#screen_objects/cart-screen.ts";
import ContactScreen from "#screen_objects/contact-screen.ts";
import LoginScreen from "#screen_objects/login-screen.ts";
import OrderScreen from "#screen_objects/order-screen.ts";
import ShopScreen from "#screen_objects/shop-screen.ts";
import NativeAlert from "#screen_objects/components/native-alert.ts";
import { loginViaApi, startLoggedOut } from "#helpers/session-flow.ts";
import { hideKeyboard, openDeepLink, scrollUntilDisplayed } from "#helpers/utils.ts";
import { products, users } from "#data/test-data.ts";
import * as shopApi from "#helpers/shop-api.ts";
import { Tag } from "#support/tags.ts";

describe("Exercises: solutions", () => {
    it(`1. the category filter shows only home products ${Tag.EXERCISE}`, async () => {
        await loginViaApi("shop");
        await ShopScreen.waitForProducts();

        await ShopScreen.category("home").click();
        await expect(ShopScreen.productName(products.mug.id)).toBeDisplayed();
        await expect(ShopScreen.productName(products.lamp.id)).toBeDisplayed();
        await expect(ShopScreen.productName(products.mouse.id)).not.toBeDisplayed();

        await ShopScreen.category("all").click();
        await scrollUntilDisplayed(ShopScreen.catalogEnd);
        await expect(ShopScreen.catalogEnd).toHaveText("You have seen all 5 products");
    });

    it(`2. an empty login shows "Email and password are required" ${Tag.EXERCISE}`, async () => {
        await startLoggedOut();

        await LoginScreen.loginButton.click();

        await expect(LoginScreen.loginError).toHaveText("Email and password are required");
    });

    it(`3. the contact form rejects a message that is too short ${Tag.EXERCISE}`, async () => {
        await startLoggedOut();
        await LoginScreen.contactLink.click();
        await ContactScreen.waitForIsShown();

        await ContactScreen.fill({ name: "Ana", topic: "payment", via: "email", message: "Hi", acceptTerms: true });
        await ContactScreen.send();

        await expect(ContactScreen.fieldError("message")).toHaveText("Message must be at least 10 characters");
        await expect(ContactScreen.fieldError("name")).not.toBeDisplayed();
        await expect(ContactScreen.fieldError("topic")).not.toBeDisplayed();
        await expect(ContactScreen.fieldError("via")).not.toBeDisplayed();
    });

    it(`4. "+1" in the cart raises the quantity and the total ${Tag.EXERCISE}`, async () => {
        await loginViaApi("cart", (token) => shopApi.addToCart(token, products.shoes.id));
        await CartScreen.waitForIsShown();

        await CartScreen.increaseButton(products.shoes.id).click();

        await expect(CartScreen.itemQuantity(products.shoes.id)).toHaveText("× 2");
        await expect(CartScreen.total).toHaveText("€129.98");
    });

    it(`5. "Empty cart" asks first, then empties the cart ${Tag.EXERCISE}`, async () => {
        const token = await loginViaApi("cart", async (t) => {
            await shopApi.addToCart(t, products.mouse.id);
            await shopApi.addToCart(t, products.lamp.id);
        });
        await CartScreen.waitForIsShown();

        await scrollUntilDisplayed(CartScreen.clearCartButton);
        await CartScreen.clearCartButton.click();
        await NativeAlert.waitForAlert();
        await NativeAlert.tapButton("Cancel");
        await expect(CartScreen.item(products.mouse.id)).toBeDisplayed();

        await CartScreen.clearCartButton.click();
        await NativeAlert.waitForAlert();
        expect(await NativeAlert.text()).toContain("Empty the cart?");
        await NativeAlert.tapButton("Empty cart");

        await expect(CartScreen.emptyCart).toHaveText("Your cart is empty");
        expect((await shopApi.getCart(token)).count).toBe(0);
    });

    it(`6. a deep link to the cart survives the login ${Tag.EXERCISE}`, async () => {
        await startLoggedOut();

        await openDeepLink("demoshop://cart");
        await LoginScreen.waitForIsShown();
        await LoginScreen.login(users.valid.email, users.valid.password);

        await CartScreen.waitForIsShown();
        await expect(CartScreen.emptyCart).toHaveText("Your cart is empty");
    });

    it(`7. a declined order: the cart is empty afterwards ${Tag.EXERCISE}`, async () => {
        await loginViaApi("cart", async (token) => {
            await shopApi.addToCart(token, products.keyboard.id);
            await shopApi.setPaymentProvider(token, "DECLINE", 300);
        });
        await CartScreen.waitForIsShown();

        await CartScreen.checkout();
        await expect(OrderScreen.status).toHaveText("REJECTED", { wait: 10000 });
        await OrderScreen.backToShopButton.click();

        await ShopScreen.waitForIsShown();
        await hideKeyboard();
        await expect(ShopScreen.cartCount).toHaveText("0");
    });
});
