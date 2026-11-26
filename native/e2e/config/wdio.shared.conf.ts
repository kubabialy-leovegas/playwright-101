import os from "node:os";
import path from "node:path";

/*
 * Settings shared by iOS and Android. wdio.ios.conf.ts and wdio.android.conf.ts import this
 * object, add their capabilities and adjust a few values, like the real lvuk-native-apps suite.
 */

// Appium finds its drivers in APPIUM_HOME. Set it in ~/.zshrc too, so `npx appium driver list` works.
process.env.APPIUM_HOME ??= path.join(os.homedir(), ".appium");

export const config: WebdriverIO.Config = {
    runner: "local",
    tsConfigPath: "./tsconfig.json",

    // The lessons, in order (01, 02, ...). The exercises (99-...) are not picked up here;
    // run them with npm run test:<platform>:exercises. (An `exclude` would also drop them when passed with --spec.)
    specs: ["../tests/specs/0*.spec.ts"],

    // One device, one session at a time.
    maxInstances: 1,
    capabilities: [],

    logLevel: "warn",
    outputDir: "./logs",
    bail: 0,

    // Default wait for waitForDisplayed, waitUntil and the expect matchers.
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 1,

    // Starts Appium for you on port 4723 and stops it at the end of the run. Its log goes to ./logs/appium.log.
    port: 4723,
    services: [["appium", { command: "appium", logPath: "./logs" }]],

    // Run a failed spec file once more, as lvuk-native-apps does. Simulators and emulators have bad moments.
    specFileRetries: 1,

    framework: "mocha",
    reporters: ["spec"],
    mochaOpts: {
        ui: "bdd",
        timeout: 180000,
    },

    // Save a screenshot of every failed test to ./logs, next to the Appium log.
    afterTest: async function (test, _context, { error }) {
        if (!error) {
            return;
        }
        const name = `${test.parent} ${test.title}`.replace(/@\S+/g, "").replace(/[^a-zA-Z0-9]+/g, "-").slice(0, 100);
        await driver.saveScreenshot(`./logs/FAILED-${name}.png`).catch(() => undefined);
    },
};
