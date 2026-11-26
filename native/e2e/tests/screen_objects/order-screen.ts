import AppScreen from "#screen_objects/app-screen.ts";
import { locatorStrategy } from "#helpers/utils.ts";

const SELECTORS = {
    SCREEN: "order-screen",
    ORDER_ID: "order-id",
    ORDER_STATUS: "order-status",
    ORDER_REASON: "order-reason",
    ORDER_TOTAL: "order-total",
    BACK_TO_SHOP: "back-to-shop-button",
} as const;

class OrderScreen extends AppScreen {
    constructor() {
        super(SELECTORS.SCREEN);
    }

    get orderId() {return $(locatorStrategy(SELECTORS.ORDER_ID));}
    get status() {return $(locatorStrategy(SELECTORS.ORDER_STATUS));}
    get reason() {return $(locatorStrategy(SELECTORS.ORDER_REASON));}
    get total() {return $(locatorStrategy(SELECTORS.ORDER_TOTAL));}
    get backToShopButton() {return $(locatorStrategy(SELECTORS.BACK_TO_SHOP));}
}
export default new OrderScreen();
