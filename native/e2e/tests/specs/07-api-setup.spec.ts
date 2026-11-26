/**
 * LESSON 7: Prepare data through the API, test the screen
 *
 * Testing the "declined payment" message through the UI alone means: log in, find a product,
 * add it, open the cart, check out... and you still cannot make the payment fail.
 * Instead, like player-api.ts in lvuk-native-apps, call the backend directly:
 *   1. POST /api/login                      -> a session token
 *   2. POST /api/cart                       -> products in that session's cart
 *   3. PUT  /api/test/payment-provider      -> make the payment fail (test-only endpoint)
 *   4. demoshop://session/<token>?to=cart   -> the app uses that session (test-only deep link)
 * Then the UI test only does what it is about: place the order, check the message.
 *
 * The backend must be running: `cd backend && mvn spring-boot:run`.
 */
import { locatorStrategy, openDeepLink, restartApp, scrollUntilDisplayed } from "#helpers/utils.ts";
import * as shopApi from "#helpers/shop-api.ts";

const byId = (testId: string) => $(locatorStrategy(testId));

describe("Lesson 7: API setup", () => {
    let token: string;

    before(async () => {
        if (!(await shopApi.isBackendUp())) {
            throw new Error(`Backend not reachable at ${shopApi.API_URL}. Start it: cd backend && mvn spring-boot:run`);
        }
    });

    beforeEach(async () => {
        // A fresh session (and an empty cart) for every test.
        token = await shopApi.login("qa@example.com", "password123");
        await restartApp();
        // Wait until the app is ready: a deep link sent while it is still starting gets lost.
        await byId("login-screen").waitForDisplayed();
    });

    it("a cart filled through the API shows in the app @smoke", async () => {
        await shopApi.addToCart(token, 1, 2); // 2 x Wireless Mouse
        await shopApi.addToCart(token, 3); // 1 x Coffee Mug

        await openDeepLink(`demoshop://session/${token}?to=cart`);

        await expect(byId("cart-item-qty-1")).toHaveText("× 2");
        await expect(byId("cart-item-qty-3")).toHaveText("× 1");
        await expect(byId("cart-total")).toHaveText("€47.48");
    });

    it("a declined payment shows the reason", async () => {
        await shopApi.addToCart(token, 2);
        await shopApi.setPaymentProvider(token, "DECLINE", 500);

        await openDeepLink(`demoshop://session/${token}?to=cart`);
        await byId("checkout-button").click();

        await expect(byId("order-status")).toHaveText("REJECTED");
        await expect(byId("order-reason")).toHaveText("Payment declined");
    });

    it("what the app did is visible through the API too", async () => {
        await openDeepLink(`demoshop://session/${token}?to=shop`);
        // The last product is below the fold. On Android it does not exist until you scroll to it.
        await scrollUntilDisplayed(byId("add-to-cart-5"));
        await byId("add-to-cart-5").click();
        await expect(byId("cart-count")).toHaveText("1");

        // Check the backend, not only the screen.
        const cart = await shopApi.getCart(token);
        expect(cart.count).toBe(1);
        expect(cart.total).toBe(64.99);
    });
});
