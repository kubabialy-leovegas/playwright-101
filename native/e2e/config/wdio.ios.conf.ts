import path from "node:path";
import { config } from "./wdio.shared.conf.ts";

/*
 * iOS simulator run. Boot the simulator before running (Simulator app, or
 * `xcrun simctl boot "iPhone 17"`). Override the device per run, e.g.
 * IOS_DEVICE="iPhone 17 Pro" IOS_VERSION=26.3 npm run test:ios
 */

// The first session after installing the driver builds WebDriverAgent, which can take minutes.
config.connectionRetryTimeout = 300000;

config.capabilities = [
    {
        platformName: "iOS",
        "appium:automationName": "XCUITest",
        "appium:deviceName": process.env.IOS_DEVICE ?? "iPhone 17",
        "appium:platformVersion": process.env.IOS_VERSION ?? "26.1",
        "appium:app": path.resolve("app/ios/DemoShop.app"),
        "appium:bundleId": "com.example.demoshop",
        // Keep the simulator and the installed app between specs; tests restart the app themselves.
        "appium:noReset": true,
        "appium:newCommandTimeout": 240,
        "appium:wdaLaunchTimeout": 240000,
    },
];

export { config };
