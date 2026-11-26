/**
 * LESSON 5: iOS vs Android
 *
 * One test should cover both platforms, but the platforms are not the same:
 *   - Element types:  XCUIElementTypeSwitch vs android.widget.Switch
 *   - Attributes:     a switch is value "1"/"0" on iOS, checked "true"/"false" on Android
 *   - Navigation:     Android has a system back button (driver.back()); iOS does not
 *   - Native alerts:  driver.getAlertText() works on iOS; on Android UiAutomator2 does not recognise
 *                     React Native's dialog, so we read the dialog's elements instead
 *
 * Keep the differences in ONE place (a helper or a screen object), behind
 * driver.isIOS / driver.isAndroid, so the test itself reads the same for both.
 */
import { hideKeyboard, locatorStrategy, restartApp } from "#helpers/utils.ts";

const byId = (testId: string) => $(locatorStrategy(testId));

async function login(): Promise<void> {
    await byId("email-input").setValue("qa@example.com");
    await byId("password-input").setValue("password123");
    await hideKeyboard();
    await byId("login-button").click();
    await byId("shop-screen").waitForDisplayed();
}

/** The difference lives here, not in the tests. */
async function isSwitchOn(element: ReturnType<typeof $>): Promise<boolean> {
    return driver.isIOS
        ? (await element.getAttribute("value")) === "1"
        : (await element.getAttribute("checked")) === "true";
}

/**
 * Title and message of the open native alert.
 * Android: UiAutomator2's alert commands look for Android's own title id (android:id/alertTitle);
 * React Native's dialog uses "alert_title", so getAlertText() says "no alert" there.
 */
async function alertText(): Promise<string> {
    if (driver.isIOS) {
        return driver.getAlertText();
    }
    return $('//*[contains(@resource-id, "alert_title")]').getText();
}

async function waitForAlert(): Promise<void> {
    await driver.waitUntil(() => alertText().then(() => true, () => false), { timeout: 5000, timeoutMsg: "No alert appeared" });
}

/** Taps a button in a native alert by its text. Android dialogs may show the text in capitals. */
async function tapAlertButton(label: string): Promise<void> {
    const button = driver.isIOS
        // Look inside the alert only: the screen behind it can have a button with the same text.
        ? $(`-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeButton[\`label == "${label}"\`]`)
        : $(`//android.widget.Button[@text="${label}" or @text="${label.toUpperCase()}"]`);
    await button.click();
}

describe("Lesson 5: platform differences", () => {
    beforeEach(async () => {
        await restartApp();
        await byId("login-screen").waitForDisplayed();
    });

    it("the same switch, read on two platforms", async () => {
        await byId("contact-link").click();
        const terms = byId("terms-switch");

        // What the driver sees. Print it once, then use a helper.
        console.log("Switch type:", driver.isIOS ? await terms.getTagName() : await terms.getAttribute("className"));

        expect(await isSwitchOn(terms)).toBe(false);
        await terms.click();
        expect(await isSwitchOn(terms)).toBe(true);
    });

    it("a disabled button: the Send button is off until the terms are accepted", async () => {
        await byId("contact-link").click();

        await expect(byId("send-button")).toBeDisabled();
        await byId("terms-switch").click();
        await expect(byId("send-button")).toBeEnabled();
    });

    it("Android back button returns to the previous screen", async function () {
        if (driver.isIOS) {
            // iOS has no system back button; the app's own "‹ Login" link does that job.
            this.skip();
        }
        await byId("contact-link").click();
        await expect(byId("contact-screen")).toBeDisplayed();

        await driver.back();
        await expect(byId("login-screen")).toBeDisplayed();
    });

    it("a native alert: cancel keeps you logged in, confirm logs you out @smoke", async () => {
        await login();

        await byId("logout-button").click();
        await waitForAlert();
        expect(await alertText()).toContain("Log out?");
        await tapAlertButton("Cancel");
        await expect(byId("shop-screen")).toBeDisplayed();

        await byId("logout-button").click();
        await waitForAlert();
        await tapAlertButton("Log out");
        await expect(byId("login-screen")).toBeDisplayed();
    });
});
