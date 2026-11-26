/**
 * LESSON 8: Screen objects and flows
 *
 * Lessons 1 to 7 repeat testIDs and steps in every test. When a testID changes,
 * you fix it in 20 places. Screen objects (tests/screen_objects/) keep:
 *   - the selectors of one screen in one place (SELECTORS at the top of each file)
 *   - what a user can do there (login(), addToCart(), fill(), send())
 * Flows (tests/helpers/session-flow.ts) chain screens: loginViaUi(), loginViaApi().
 * This is exactly how lvuk-native-apps is organised: compare login-screen.ts there and here.
 *
 * A good test now reads like the test case in TestRail.
 */
import CartScreen from "#screen_objects/cart-screen.ts";
import ContactScreen from "#screen_objects/contact-screen.ts";
import LoginScreen from "#screen_objects/login-screen.ts";
import OrderScreen from "#screen_objects/order-screen.ts";
import ShopScreen from "#screen_objects/shop-screen.ts";
import { loginViaApi, loginViaUi, startLoggedOut } from "#helpers/session-flow.ts";
import { products, users } from "#data/test-data.ts";
import * as shopApi from "#helpers/shop-api.ts";
import { Tag } from "#support/tags.ts";

describe("Lesson 8: screen objects", () => {
    it(`wrong password shows an error ${Tag.REGRESSION}`, async () => {
        await startLoggedOut();

        await LoginScreen.login(users.valid.email, "wrong-password");

        await expect(LoginScreen.loginError).toHaveText("Invalid email or password");
    });

    it(`buy a product from search to confirmed order ${Tag.SMOKE}`, async () => {
        await loginViaUi();
        await ShopScreen.waitForProducts();

        await ShopScreen.search("lamp");
        await expect(ShopScreen.productName(products.lamp.id)).toHaveText(products.lamp.name);
        await ShopScreen.addToCart(products.lamp.id);
        await expect(ShopScreen.cartCount).toHaveText("1");

        await ShopScreen.cartButton.click();
        await expect(CartScreen.total).toHaveText(products.lamp.price);
        await CartScreen.checkout();

        await expect(OrderScreen.status).toHaveText("CONFIRMED", { wait: 10000 });
    });

    it(`remove a product from the cart by swiping ${Tag.REGRESSION}`, async () => {
        await loginViaApi("cart", async (token) => {
            await shopApi.addToCart(token, products.mouse.id);
            await shopApi.addToCart(token, products.mug.id);
        });
        await CartScreen.waitForIsShown();

        await CartScreen.removeBySwipe(products.mouse.id);

        await expect(CartScreen.item(products.mug.id)).toBeDisplayed();
        await expect(CartScreen.total).toHaveText(products.mug.price);
    });

    it(`contact form shows every field error from the backend ${Tag.REGRESSION}`, async () => {
        await startLoggedOut();
        await LoginScreen.contactLink.click();
        await ContactScreen.waitForIsShown();

        // Only accept the terms, so the Send button is enabled; leave the rest empty.
        await ContactScreen.fill({ acceptTerms: true });
        await ContactScreen.send();

        await expect(ContactScreen.fieldError("name")).toHaveText("Name is required");
        await expect(ContactScreen.fieldError("topic")).toHaveText("Choose a topic");
        await expect(ContactScreen.fieldError("via")).toHaveText("Choose email or phone");
    });

    it(`contact form sends a ticket ${Tag.SMOKE}`, async () => {
        await loginViaApi("contact");
        await ContactScreen.waitForIsShown();

        await ContactScreen.fill({ name: "Ana", topic: "order", via: "phone", message: "Where is my order?", acceptTerms: true });
        await ContactScreen.send();

        await expect(ContactScreen.success).toHaveText("Thanks Ana!", { containing: true });
        await expect(ContactScreen.success).toHaveText("We will reply by phone.", { containing: true });
    });
});
