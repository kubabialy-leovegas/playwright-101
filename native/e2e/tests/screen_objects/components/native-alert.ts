/**
 * Native alerts (React Native's Alert.alert) are not part of our screen:
 * iOS shows a UIAlertController and Android an AlertDialog, each with its own element tree.
 *
 * iOS: the WebDriver alert commands (driver.getAlertText()) work.
 * Android: UiAutomator2 only recognises dialogs with Android's own title id (android:id/alertTitle).
 * React Native's dialog uses its own "alert_title", so getAlertText() says "no alert".
 * The dialog is still made of normal elements, so we read those instead.
 */
const ANDROID_TITLE = '//*[@resource-id="android:id/alertTitle" or contains(@resource-id, ":id/alert_title")]';
const ANDROID_MESSAGE = '//*[@resource-id="android:id/message"]';

class NativeAlert {
    async isOpen(): Promise<boolean> {
        if (driver.isIOS) {
            return driver.getAlertText().then(() => true, () => false);
        }
        return $(ANDROID_TITLE).isDisplayed().catch(() => false);
    }

    async waitForAlert(timeout = 5000): Promise<void> {
        await driver.waitUntil(() => this.isOpen(), { timeout, timeoutMsg: "No native alert appeared" });
    }

    /** Title and message of the open alert, e.g. "Log out?\nYour cart will be emptied." */
    async text(): Promise<string> {
        if (driver.isIOS) {
            return driver.getAlertText();
        }
        const title = await $(ANDROID_TITLE).getText();
        const message = await $(ANDROID_MESSAGE).getText().catch(() => "");
        return message ? `${title}\n${message}` : title;
    }

    /** Taps an alert button by the text on it. Android shows dialog buttons in capitals, so we match both. */
    async tapButton(label: string): Promise<void> {
        const button = driver.isIOS
            // Look inside the alert only: the screen behind it can have a button with the same text.
            ? $(`-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeButton[\`label == "${label}"\`]`)
            : $(`//android.widget.Button[@text="${label}" or @text="${label.toUpperCase()}"]`);
        await button.click();
    }
}
export default new NativeAlert();
