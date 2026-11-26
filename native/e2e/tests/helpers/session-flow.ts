import LoginScreen from "#screen_objects/login-screen.ts";
import ShopScreen from "#screen_objects/shop-screen.ts";
import { users } from "#data/test-data.ts";
import { openDeepLink, restartApp } from "#helpers/utils.ts";
import * as shopApi from "#helpers/shop-api.ts";

/** Fresh app on the login screen. Use in beforeEach so every test starts from the same place. */
export async function startLoggedOut(): Promise<void> {
    await restartApp();
    await LoginScreen.waitForIsShown();
}

/** Logs in through the UI, the way a user does. Slow, so only for tests about login itself. */
export async function loginViaUi(email: string = users.valid.email, password: string = users.valid.password): Promise<void> {
    await startLoggedOut();
    await LoginScreen.login(email, password);
    await ShopScreen.waitForIsShown();
}

/**
 * Logs in through the API and hands the session to the app with a test-only deep link.
 * Returns the token, so the test can prepare more data (cart, payment provider) for the same session.
 */
export async function loginViaApi(to: "shop" | "cart" | "contact" = "shop", prepare?: (token: string) => Promise<void>): Promise<string> {
    const token = await shopApi.login(users.valid.email, users.valid.password);
    if (prepare) {
        await prepare(token);
    }
    await startLoggedOut();
    await openDeepLink(`demoshop://session/${token}?to=${to}`);
    return token;
}
