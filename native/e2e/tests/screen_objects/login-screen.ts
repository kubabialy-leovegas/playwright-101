import AppScreen from "#screen_objects/app-screen.ts";
import { hideKeyboard, locatorStrategy } from "#helpers/utils.ts";

const SELECTORS = {
    SCREEN: "login-screen",
    EMAIL_INPUT: "email-input",
    PASSWORD_INPUT: "password-input",
    PASSWORD_TOGGLE: "password-toggle",
    LOGIN_BUTTON: "login-button",
    LOGIN_ERROR: "login-error",
    CONTACT_LINK: "contact-link",
} as const;

class LoginScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    get emailInput() {return $(locatorStrategy(SELECTORS.EMAIL_INPUT));}
    get passwordInput() {return $(locatorStrategy(SELECTORS.PASSWORD_INPUT));}
    get passwordToggle() {return $(locatorStrategy(SELECTORS.PASSWORD_TOGGLE));}
    get loginButton() {return $(locatorStrategy(SELECTORS.LOGIN_BUTTON));}
    get loginError() {return $(locatorStrategy(SELECTORS.LOGIN_ERROR));}
    get contactLink() {return $(locatorStrategy(SELECTORS.CONTACT_LINK));}

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await hideKeyboard();
        await this.loginButton.click();
    }
}
export default new LoginScreen();
