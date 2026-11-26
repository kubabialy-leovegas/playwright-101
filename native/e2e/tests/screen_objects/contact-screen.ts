import AppScreen from "#screen_objects/app-screen.ts";
import { hideKeyboard, locatorStrategy, scrollUntilDisplayed } from "#helpers/utils.ts";

const SELECTORS = {
    SCREEN: "contact-screen",
    BACK_BUTTON: "back-button",
    NAME_INPUT: "contact-name",
    MESSAGE_INPUT: "contact-message",
    TERMS_SWITCH: "terms-switch",
    SEND_BUTTON: "send-button",
    SUCCESS: "contact-success",
} as const;

export type ContactForm = {
    name?: string;
    topic?: "order" | "payment" | "other";
    via?: "email" | "phone";
    message?: string;
    acceptTerms?: boolean;
};

class ContactScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    get backButton() {return $(locatorStrategy(SELECTORS.BACK_BUTTON));}
    get nameInput() {return $(locatorStrategy(SELECTORS.NAME_INPUT));}
    get messageInput() {return $(locatorStrategy(SELECTORS.MESSAGE_INPUT));}
    get termsSwitch() {return $(locatorStrategy(SELECTORS.TERMS_SWITCH));}
    get sendButton() {return $(locatorStrategy(SELECTORS.SEND_BUTTON));}
    get success() {return $(locatorStrategy(SELECTORS.SUCCESS));}

    topic(value: "order" | "payment" | "other") {return $(locatorStrategy(`topic-${value}`));}
    via(value: "email" | "phone") {return $(locatorStrategy(`via-${value}`));}
    fieldError(field: "name" | "topic" | "via" | "message" | "terms") {return $(locatorStrategy(`error-${field}`));}

    /** A switch reports its state differently per platform: iOS value "1"/"0", Android checked "true"/"false". */
    async isTermsAccepted(): Promise<boolean> {
        return driver.isIOS
            ? (await this.termsSwitch.getAttribute("value")) === "1"
            : (await this.termsSwitch.getAttribute("checked")) === "true";
    }

    /** Fills only the fields you pass, so tests can leave fields out on purpose. */
    async fill(form: ContactForm): Promise<void> {
        if (form.name !== undefined) {
            await this.nameInput.setValue(form.name);
            await hideKeyboard();
        }
        if (form.topic) {
            await this.topic(form.topic).click();
        }
        if (form.via) {
            await this.via(form.via).click();
        }
        if (form.message !== undefined) {
            await scrollUntilDisplayed(this.messageInput);
            await this.messageInput.setValue(form.message);
            await hideKeyboard();
        }
        if (form.acceptTerms !== undefined && form.acceptTerms !== (await this.isTermsAccepted())) {
            await scrollUntilDisplayed(this.termsSwitch);
            await this.termsSwitch.click();
        }
    }

    async send(): Promise<void> {
        await scrollUntilDisplayed(this.sendButton);
        await this.sendButton.click();
    }
}
export default new ContactScreen();
