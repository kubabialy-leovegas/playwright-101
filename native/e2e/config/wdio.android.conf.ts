import path from "node:path";
import { config } from "./wdio.shared.conf.ts";

/*
 * Android emulator run. Start the emulator before running
 * (`emulator -avd Pixel_9_API_36`, or Device Manager in Android Studio).
 * The app reaches the backend on the host machine through 10.0.2.2:8080.
 */

config.capabilities = [
    {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:deviceName": process.env.ANDROID_DEVICE ?? "Pixel 9",
        "appium:app": path.resolve("app/android/demo-shop.apk"),
        "appium:appPackage": "com.example.demoshop",
        "appium:appActivity": ".MainActivity",
        // Keep the installed app between specs; tests restart the app themselves.
        "appium:noReset": true,
        "appium:autoGrantPermissions": true,
        "appium:newCommandTimeout": 240,
        "appium:uiautomator2ServerInstallTimeout": 120000,
    },
];

/*
 * Before every command UiAutomator2 waits (up to 10 s) until the app is "idle". A spinner or any
 * running animation keeps the app busy, so every command next to a spinner would take 10 s.
 * Switching the wait off completely (0) is too much: taps then land during screen transitions
 * and get lost. One second lets transitions finish and costs at most 1 s next to a spinner.
 */
config.before = async function () {
    await driver.updateSettings({ waitForIdleTimeout: 1000 });
};

export { config };
