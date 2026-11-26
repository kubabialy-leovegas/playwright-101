/*
 * Tags go at the end of a test title, as in lvuk-native-apps.
 * Run one tag with: npm run test:ios -- --mochaOpts.grep @smoke
 */
export const Tag = {
    SMOKE: "@smoke",
    REGRESSION: "@regression",
    EXERCISE: "@exercise",
} as const;
