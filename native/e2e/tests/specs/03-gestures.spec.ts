/**
 * LESSON 3: Typing, tapping, scrolling and swiping
 *
 *   element.click()          a tap
 *   element.setValue("x")    clears the field, then types
 *   element.addValue("x")    types at the end, keeps what is there (iOS only! On Android it replaces the text)
 *   element.clearValue()     empties the field
 *   hideKeyboard()           the keyboard covers half the screen; hide it before tapping below it
 *
 * There is no mouse wheel on a phone. Scrolling and swiping are finger movements:
 * W3C pointer actions (driver.action("pointer")) say "put a finger here, move it there, lift it".
 * See drag(), scrollUntilDisplayed() and swipeLeft() in helpers/utils.ts.
 */
import { hideKeyboard, locatorStrategy, restartApp, scrollUntilDisplayed, swipeLeft } from "#helpers/utils.ts";

async function login(): Promise<void> {
    await $(locatorStrategy("email-input")).setValue("qa@example.com");
    await $(locatorStrategy("password-input")).setValue("password123");
    await hideKeyboard();
    await $(locatorStrategy("login-button")).click();
    await $(locatorStrategy("product-list")).waitForDisplayed();
}

describe("Lesson 3: gestures", () => {
    beforeEach(async () => {
        await restartApp();
        await $(locatorStrategy("login-screen")).waitForDisplayed();
    });

    it("type, add and clear text", async () => {
        const email = $(locatorStrategy("email-input"));

        await email.setValue("qa@");
        await email.addValue("example.com");
        // A real difference between the drivers: UiAutomator2 sets the whole text, it does not append.
        await expect(email).toHaveText(driver.isIOS ? "qa@example.com" : "example.com");

        await email.clearValue();
        // An empty field reports its placeholder as its text, on both platforms.
        await expect(email).toHaveText("you@example.com");
    });

    it("tap a toggle: show and hide the password", async () => {
        const toggle = $(locatorStrategy("password-toggle"));

        await toggle.click();
        await expect(toggle).toHaveAttribute(driver.isIOS ? "label" : "content-desc", "Hide password");
        await toggle.click();
        await expect(toggle).toHaveAttribute(driver.isIOS ? "label" : "content-desc", "Show password");
    });

    it("hide the keyboard before tapping what it covers", async () => {
        await $(locatorStrategy("email-input")).click();
        expect(await driver.isKeyboardShown()).toBe(true);

        await hideKeyboard();
        expect(await driver.isKeyboardShown()).toBe(false);
    });

    it("scroll down to the end of the product list", async () => {
        await login();
        const end = $(locatorStrategy("catalog-end"));

        await scrollUntilDisplayed(end);
        await expect(end).toHaveText("You have seen all 5 products");
    });

    it("swipe a cart item to the left to remove it", async () => {
        await login();
        await $(locatorStrategy("add-to-cart-1")).click();
        await expect($(locatorStrategy("cart-count"))).toHaveText("1");
        await $(locatorStrategy("nav-cart")).click();

        const item = $(locatorStrategy("cart-item-1"));
        await expect(item).toBeDisplayed();

        await swipeLeft(item);
        await expect($(locatorStrategy("empty-cart"))).toBeDisplayed();
    });
});
