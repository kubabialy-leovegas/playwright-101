/**
 * LESSON 4: Assertions and waiting (never "pause")
 *
 * The app waits ~1.2 s for the product list, a toast disappears after 2 s,
 * and an order stays PENDING until the payment provider answers (~1.5 s).
 * A bad test would do:  await driver.pause(3000)   // DON'T
 *   - too short on a slow simulator   -> flaky test
 *   - too long on a fast one          -> slow suite
 *
 * expect-webdriverio matchers retry until they pass or time out (waitforTimeout, 15 s):
 *   toBeDisplayed, toHaveText, toBeEnabled, toBeElementsArrayOfSize ...
 * For "wait until it is GONE": expect($(...)).not.toBeDisplayed(), or waitUntilGone() from helpers/utils.ts.
 *   Careful on iOS: waitForDisplayed({ reverse: true }) on an element you already found can keep saying
 *   "displayed" after it is gone. Look the element up again instead: $() inside expect() does that.
 * For anything else: driver.waitUntil(async () => condition).
 */
import { hideKeyboard, locatorStrategy, restartApp, scrollUntilDisplayed, waitUntilGone } from "#helpers/utils.ts";

const byId = (testId: string) => $(locatorStrategy(testId));

describe("Lesson 4: assertions and waiting", () => {
    beforeEach(async () => {
        await restartApp();
        await byId("email-input").setValue("qa@example.com");
        await byId("password-input").setValue("password123");
        await hideKeyboard();
        await byId("login-button").click();
    });

    it("a spinner shows while products load, then the list replaces it @smoke", async () => {
        // Right after login the products are still loading.
        await expect(byId("products-loading")).toBeDisplayed();

        // No pause needed: this waits until the list arrives.
        await expect(byId("product-list")).toBeDisplayed();
        await expect(byId("products-loading")).not.toBeDisplayed();
        await expect(byId("product-name-1")).toHaveText("Wireless Mouse");
    });

    it("a toast appears and disappears by itself", async () => {
        await byId("add-to-cart-1").click();

        await expect(byId("toast-message")).toHaveText("Wireless Mouse added to cart");

        // Wait for it to go away, at most 5 s. Both lines do the same; pick one.
        await expect(byId("toast-message")).not.toBeDisplayed({ wait: 5000 });
        await waitUntilGone("toast-message", 5000);
    });

    it("text matchers: exact, containing, and a number that changes", async () => {
        await expect(byId("user-email")).toHaveText("Logged in as qa@example.com");
        await expect(byId("user-email")).toHaveText("qa@example.com", { containing: true });

        await expect(byId("cart-count")).toHaveText("0");
        await byId("add-to-cart-2").click();
        await expect(byId("cart-count")).toHaveText("1");
    });

    it("an order goes from PENDING to CONFIRMED", async () => {
        // The third product is below the fold on a small screen; on Android it only exists once on screen.
        await scrollUntilDisplayed(byId("add-to-cart-3"));
        await byId("add-to-cart-3").click();
        await expect(byId("cart-count")).toHaveText("1");
        await byId("nav-cart").click();
        await byId("checkout-button").click();

        // It starts PENDING, then the backend confirms the payment.
        await expect(byId("order-status")).toHaveText("PENDING");
        await expect(byId("order-status")).toHaveText("CONFIRMED", { wait: 10000 });
    });

    it("waitUntil: wait for any condition you can write", async () => {
        await byId("search-input").setValue("zzz");
        await hideKeyboard();

        await driver.waitUntil(async () => await byId("no-results").isDisplayed(), {
            timeout: 5000,
            timeoutMsg: "Expected the 'no results' message after searching for zzz",
        });
        await expect(byId("catalog-end")).not.toBeDisplayed();
    });

    it("the order total matches the cart total", async () => {
        await byId("add-to-cart-1").click();
        await expect(byId("cart-count")).toHaveText("1");
        await byId("nav-cart").click();

        const cartTotal = await byId("cart-total").getText();
        await scrollUntilDisplayed(byId("checkout-button"));
        await byId("checkout-button").click();

        await expect(byId("order-total")).toHaveText(`Total ${cartTotal}`);
    });
});
