/**
 * LESSON 1: Anatomy of a native test
 *
 * What happens when you run `npm run test:ios`:
 *   1. WebdriverIO starts Appium (services: ["appium"] in config/wdio.shared.conf.ts).
 *   2. It asks Appium for a SESSION with the CAPABILITIES in wdio.ios.conf.ts:
 *      which platform, which driver (XCUITest / UiAutomator2), which device, which app.
 *   3. Appium installs and opens the app on the simulator/emulator.
 *   4. Mocha runs the describe/it blocks. `driver` is the session; `$()` finds elements.
 *
 * One session per spec FILE, so the app keeps running between the tests in a file.
 * That is why every test starts with restartApp(): a clean app, the same starting point.
 */
import { locatorStrategy, restartApp } from "#helpers/utils.ts";

describe("Lesson 1: first session", () => {
    beforeEach(async () => {
        await restartApp();
    });

    it("the app starts on the login screen @smoke", async () => {
        const loginScreen = $(locatorStrategy("login-screen"));

        // expect() retries until the element is displayed, or fails after waitforTimeout (15 s).
        await expect(loginScreen).toBeDisplayed();
        await expect($(locatorStrategy("login-button"))).toBeDisplayed();
    });

    it("the driver knows which platform and device it is talking to", async () => {
        // The capabilities Appium actually used, after it filled in the defaults.
        const caps = driver.capabilities as Record<string, unknown>;
        console.log(`Running on ${caps.platformName} ${caps["appium:platformVersion"] ?? caps.platformVersion}`);

        expect(driver.isIOS || driver.isAndroid).toBe(true);
        expect(await driver.getWindowSize()).toHaveProperty("width");
    });

    it("a user can log in @smoke", async () => {
        await $(locatorStrategy("email-input")).setValue("qa@example.com");
        await $(locatorStrategy("password-input")).setValue("password123");
        await $(locatorStrategy("login-button")).click();

        await expect($(locatorStrategy("shop-screen"))).toBeDisplayed();
        await expect($(locatorStrategy("user-email"))).toHaveText("Logged in as qa@example.com");
    });
});
