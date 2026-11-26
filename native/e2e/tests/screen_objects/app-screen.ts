import { locatorStrategy, SCREEN_TIMEOUT, waitUntilGone } from "#helpers/utils.ts";

/**
 * Base class for every screen. It knows the testID that marks the screen (the app puts it on the
 * screen's title) and can wait for it to appear or go away.
 */
export default class AppScreen {
    private selector: string;

    constructor(rootTestId: string) {
        this.selector = rootTestId;
    }

    get root() {return $(locatorStrategy(this.selector));}

    async waitForIsShown(isShown = true, timeout = SCREEN_TIMEOUT): Promise<boolean | void> {
        if (!isShown) {
            return waitUntilGone(this.selector, timeout);
        }
        return this.root.waitForDisplayed({ timeout });
    }
}
