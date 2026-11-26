/**
 * LESSON 2: Finding elements
 *
 * Our developers put a `testID` on every element we test. React Native turns it into:
 *   - iOS:     the accessibility identifier   -> find it with "~login-button"
 *   - Android: the resource-id                -> find it with //*[@resource-id="login-button"]
 * locatorStrategy("login-button") picks the right one (helpers/utils.ts, same as lvuk-native-apps).
 *
 * Best to worst:
 *   1. testID via locatorStrategy()           stable, same name on both platforms
 *   2. the text the user sees                 OK for system dialogs; breaks when copy or language changes
 *   3. XPath on element types / positions     slow and brittle; types differ per platform
 *
 * Tip: Appium Inspector shows the element tree and the attributes of every element.
 * See "Appium Inspector" in native/README.md.
 */
import { locatorStrategy, locatorStrategyByLabel, restartApp } from "#helpers/utils.ts";

describe("Lesson 2: locators", () => {
    beforeEach(async () => {
        await restartApp();
        await $(locatorStrategy("login-screen")).waitForDisplayed();
    });

    it("by testID: the recommended way", async () => {
        await expect($(locatorStrategy("email-input"))).toBeDisplayed();
        await expect($(locatorStrategy("password-input"))).toBeDisplayed();
    });

    it("by testID, written out per platform", async () => {
        // What locatorStrategy() hides from you. Android also has UiSelector, faster than XPath.
        const selector = driver.isIOS
            ? "~email-input"
            : 'android=new UiSelector().resourceId("email-input")';

        await expect($(selector)).toBeDisplayed();
    });

    it("by visible text: when there is no testID", async () => {
        // The link's accessibilityLabel: iOS "label", Android "content-desc".
        await expect($(locatorStrategyByLabel("Need help? Contact us"))).toBeDisplayed();
    });

    it("by element type: the types are different on each platform", async () => {
        // The same two React Native <TextInput>s, seen by each driver:
        //   iOS:     XCUIElementTypeTextField + XCUIElementTypeSecureTextField (password!)
        //   Android: android.widget.EditText, twice
        const fields = driver.isIOS
            ? $$("-ios class chain:**/XCUIElementTypeTextField")
            : $$("//android.widget.EditText");

        // iOS counts only the email field: the password field has another type.
        await expect(fields).toBeElementsArrayOfSize(driver.isIOS ? 1 : 2);
    });

    it("an element that is not there: check without failing the test", async () => {
        // The error only appears after a failed login.
        const error = $(locatorStrategy("login-error"));

        expect(await error.isExisting()).toBe(false);
        await expect(error).not.toBeDisplayed();
    });
});
