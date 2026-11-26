export type ChainableElement = ReturnType<typeof $>;

export const APP_ID = "com.example.demoshop";
export const SCREEN_TIMEOUT = Number(process.env.E2E_SCREEN_TIMEOUT) || 20000;

/**
 * Finds an element by its React Native testID, on both platforms.
 * - iOS: testID becomes the accessibility identifier, so "~login-button" finds it.
 * - Android: testID becomes the resource-id. "~" would look at content-desc instead,
 *   so we use XPath on @resource-id (same helper as in lvuk-native-apps).
 */
export function locatorStrategy(testId: string): string {
    return driver.isIOS ? `~${testId}` : `//*[@resource-id="${testId}"]`;
}

/** Finds an element by the text a user sees. Use it when there is no testID, e.g. in system dialogs. */
export function locatorStrategyByLabel(label: string): string {
    return driver.isIOS
        ? `-ios predicate string:label == "${label}" AND visible == 1`
        : `//*[@text="${label}" or @content-desc="${label}"]`;
}

/**
 * Drags a finger across the screen with W3C pointer actions. Works the same on iOS and Android.
 * Coordinates are fractions of the screen: (0.5, 0.8) is the middle, near the bottom.
 */
export async function drag(from: { x: number; y: number }, to: { x: number; y: number }, durationMs = 600): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    await driver
        .action("pointer", { parameters: { pointerType: "touch" } })
        .move({ x: Math.round(width * from.x), y: Math.round(height * from.y) })
        .down()
        .pause(100)
        .move({ duration: durationMs, x: Math.round(width * to.x), y: Math.round(height * to.y) })
        .up()
        .perform();
}

/** Scrolls the content down (the finger moves up). */
export async function scrollDown(): Promise<void> {
    await drag({ x: 0.5, y: 0.75 }, { x: 0.5, y: 0.35 });
}

/** Scrolls the content up (the finger moves down). */
export async function scrollUp(): Promise<void> {
    await drag({ x: 0.5, y: 0.35 }, { x: 0.5, y: 0.75 });
}

/**
 * Scrolls down until the element is on screen.
 * Android only renders what is on screen, so an element further down does not exist yet:
 * you cannot "find it, then scroll to it". Scroll and look again instead.
 */
export async function scrollUntilDisplayed(element: ChainableElement, maxScrolls = 6): Promise<void> {
    for (let i = 0; i < maxScrolls; i++) {
        if (await element.isDisplayed().catch(() => false)) {
            return;
        }
        await scrollDown();
    }
    if (!(await element.isDisplayed().catch(() => false))) {
        throw new Error(`Element ${await element.selector} not displayed after ${maxScrolls} scrolls`);
    }
}

/** Swipes an element to the left, starting near its right edge. */
export async function swipeLeft(element: ChainableElement, distance = 0.6): Promise<void> {
    const { x, y } = await element.getLocation();
    const { width, height } = await element.getSize();
    const startX = Math.round(x + width * 0.9);
    const midY = Math.round(y + height / 2);
    await driver
        .action("pointer", { parameters: { pointerType: "touch" } })
        .move({ x: startX, y: midY })
        .down()
        .pause(100)
        .move({ duration: 500, x: Math.round(startX - width * distance), y: midY })
        .up()
        .perform();
}

/**
 * Waits until no element with this testID is on screen.
 * Looks the element up again on every check: on iOS, an element you found earlier can keep
 * answering "displayed" after it is gone, so waitForDisplayed({ reverse: true }) on it can fail.
 */
export async function waitUntilGone(testId: string, timeout = SCREEN_TIMEOUT): Promise<void> {
    await driver.waitUntil(async () => !(await $(locatorStrategy(testId)).isDisplayed().catch(() => false)), {
        timeout,
        timeoutMsg: `"${testId}" is still on screen after ${timeout} ms`,
    });
}

/** Hides the on-screen keyboard if it is open, so it cannot cover the button you want to tap. */
export async function hideKeyboard(): Promise<void> {
    if (!(await driver.isKeyboardShown().catch(() => false))) {
        return;
    }
    if (driver.isAndroid) {
        await driver.hideKeyboard();
        return;
    }
    // iOS has no "hide keyboard" key on every keyboard. The app closes it when you tap the screen title.
    await $('-ios predicate string:name ENDSWITH "-screen" AND visible == 1').click();
}

/** Restarts the app: the same as a user swiping it away and opening it again. All in-memory state is gone. */
export async function restartApp(): Promise<void> {
    await driver.terminateApp(APP_ID);
    await driver.activateApp(APP_ID);
}

/** Opens a demoshop:// link, as if the user tapped it in a message or browser. */
export async function openDeepLink(url: string): Promise<void> {
    if (driver.isIOS) {
        await driver.execute("mobile: deepLink", { url, bundleId: APP_ID });
    } else {
        await driver.execute("mobile: deepLink", { url, package: APP_ID });
    }
}
