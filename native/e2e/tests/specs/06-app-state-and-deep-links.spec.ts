/**
 * LESSON 6: App state and deep links
 *
 * A web page can be reloaded; a native app has a lifecycle:
 *   driver.background(2)        user goes to the home screen for 2 s and comes back
 *   driver.terminateApp(id)     user swipes the app away (in-memory state is lost)
 *   driver.activateApp(id)      user opens it again
 *   driver.queryAppState(id)    4 = running in the foreground, 1 = not running
 *
 * Deep links (demoshop://cart) open a screen directly, like a link in an email or a push
 * message. They are also a fast way to get a test to the screen it is about.
 * openDeepLink() in helpers/utils.ts uses Appium's "mobile: deepLink" on both platforms.
 */
import { APP_ID, hideKeyboard, locatorStrategy, openDeepLink, restartApp } from "#helpers/utils.ts";

const byId = (testId: string) => $(locatorStrategy(testId));

async function login(): Promise<void> {
    await byId("email-input").setValue("qa@example.com");
    await byId("password-input").setValue("password123");
    await hideKeyboard();
    await byId("login-button").click();
}

describe("Lesson 6: app state and deep links", () => {
    beforeEach(async () => {
        await restartApp();
        await byId("login-screen").waitForDisplayed();
    });

    it("the app is running in the foreground", async () => {
        expect(await driver.queryAppState(APP_ID)).toBe(4);
    });

    it("going to the background and back keeps you logged in", async () => {
        await login();
        await expect(byId("shop-screen")).toBeDisplayed();

        await driver.background(2);

        await expect(byId("shop-screen")).toBeDisplayed();
    });

    it("restarting the app logs you out (the session lives in memory)", async () => {
        await login();
        await expect(byId("shop-screen")).toBeDisplayed();

        await driver.terminateApp(APP_ID);
        expect(await driver.queryAppState(APP_ID)).toBe(1);
        await driver.activateApp(APP_ID);

        await expect(byId("login-screen")).toBeDisplayed();
    });

    it("a deep link opens the contact form directly @smoke", async () => {
        await openDeepLink("demoshop://contact");

        await expect(byId("contact-screen")).toBeDisplayed();
    });

    it("a deep link to the cart asks you to log in first, then opens the cart", async () => {
        await openDeepLink("demoshop://cart");
        await expect(byId("login-screen")).toBeDisplayed();

        await login();

        await expect(byId("cart-screen")).toBeDisplayed();
    });
});
