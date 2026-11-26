/**
 * EXERCISES: your turn!
 *
 * Each test below is `it.skip`, so it does not run. To work on one:
 *   1. change `it.skip` to `it`
 *   2. write the steps (use the screen objects and flows from lesson 8)
 *   3. run only this file:  npm run test:ios:exercises   (or test:android:exercises)
 *      tip: add `.only` (it.only) to run just the test you are working on
 *
 * Stuck? Open Appium Inspector to find the testIDs (native/README.md), or look at lessons 1 to 8.
 * Do them on BOTH platforms: a test that passes on one only is half done.
 */
import CartScreen from "#screen_objects/cart-screen.ts";
import ContactScreen from "#screen_objects/contact-screen.ts";
import LoginScreen from "#screen_objects/login-screen.ts";
import ShopScreen from "#screen_objects/shop-screen.ts";
import NativeAlert from "#screen_objects/components/native-alert.ts";
import { loginViaApi, loginViaUi, startLoggedOut } from "#helpers/session-flow.ts";
import { openDeepLink } from "#helpers/utils.ts";
import { products, users } from "#data/test-data.ts";
import * as shopApi from "#helpers/shop-api.ts";
import { Tag } from "#support/tags.ts";

// Remove these lines once you use the imports above; they only keep TypeScript quiet.
void [CartScreen, ContactScreen, LoginScreen, ShopScreen, NativeAlert, loginViaApi, loginViaUi, startLoggedOut, openDeepLink, products, users, shopApi];

describe("Exercises", () => {
    it.skip(`1. the category filter shows only home products ${Tag.EXERCISE}`, async () => {
        // Log in (through the API is fastest), wait for the products,
        // tap the "home" category, assert the Coffee Mug and the Desk Lamp are shown
        // and the Wireless Mouse is not. Then tap "all" and scroll to the end:
        // "You have seen all 5 products".
    });

    it.skip(`2. an empty login shows "Email and password are required" ${Tag.EXERCISE}`, async () => {
        // Start logged out, tap Log in without typing anything, assert the error text.
    });

    it.skip(`3. the contact form rejects a message that is too short ${Tag.EXERCISE}`, async () => {
        // Open the contact form, fill everything correctly except the message ("Hi"),
        // send, assert the message error "Message must be at least 10 characters"
        // and that no other field shows an error.
    });

    it.skip(`4. "+1" in the cart raises the quantity and the total ${Tag.EXERCISE}`, async () => {
        // Put 1 x Running Shoes in the cart through the API, open the cart,
        // tap +1, assert the quantity "× 2" and the total "€129.98".
    });

    it.skip(`5. "Empty cart" asks first, then empties the cart ${Tag.EXERCISE}`, async () => {
        // Put two products in the cart through the API, open the cart, tap "Empty cart".
        // In the native alert: tap "Cancel" first and check the products are still there,
        // then do it again and tap "Empty cart". Assert "Your cart is empty".
        // Bonus: check through the API that the cart count is 0.
    });

    it.skip(`6. a deep link to the cart survives the login ${Tag.EXERCISE}`, async () => {
        // Start logged out, open demoshop://cart, log in through the UI and assert you
        // land on the cart (not the shop) with "Your cart is empty".
        // Why empty? A UI login creates a NEW session, and carts belong to a session.
    });

    it.skip(`7. a declined order: the cart is empty afterwards ${Tag.EXERCISE}`, async () => {
        // Through the API: fill the cart and make the payment provider DECLINE.
        // Place the order in the app, wait for REJECTED, go back to the shop,
        // and assert the cart badge says 0 (the order took the products, even if it failed).
    });
});
