import { type Locator, type Page } from '@playwright/test';

/** Page Object for the products page. */
export class ShopPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly products: Locator;
  readonly cartCount: Locator;
  readonly searchInput: Locator;
  readonly categorySelect: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Products' });
    this.products = page.getByRole('listitem');
    this.cartCount = page.getByTestId('cart-count');
    this.searchInput = page.getByPlaceholder('Search products');
    this.categorySelect = page.getByLabel('Category');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  product(name: string): Locator {
    return this.products.filter({ hasText: name });
  }

  async addToCart(name: string) {
    await this.product(name).getByRole('button', { name: 'Add to cart' }).click();
  }
}
