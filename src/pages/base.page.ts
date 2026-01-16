import { CategoryConstants } from "@constants/category.constant";
import { Category } from "@models/category.model";
import { Product } from "@models/product.model";
import { Locator, Page } from "@playwright/test";
import { extractNumbers } from "@utils/text-helper.util";
import { MainMenuItem } from "@constants/main-menu-item.constants";

export abstract class BasePage {
  protected readonly page: Page;

  // SALE POPUP
  readonly salesPopupLocator: Locator;
  readonly closeSalesPopupButtonLocator: Locator;

  // COOKIE NOTICE
  readonly cookiePopupLocator: Locator;
  readonly acceptCookiesButtonLocator: Locator;

  // HEADER (IN CROSS-DEVICE)
  readonly headerLocator: Locator;

  // TOP HEADER
  readonly topHeaderLocator: Locator;
  readonly contactNumberTextLocator: Locator;
  readonly addressTextLocator: Locator;
  readonly loginOrSignupButtonLocator: Locator;
  readonly socailListsLocator: Locator;
  readonly socialItemLocator: Locator;

  // MAIN HEADER
  readonly mainHeaderLocator: Locator;
  readonly categoryMenuLocator: Locator;
  readonly searchInputLocator: Locator;
  readonly searchButtonLocator: Locator;

  //  CART
  readonly cartCountLocator: Locator;
  readonly productsInCartLocator: Locator;
  readonly productTitleInCartLocator: Locator;
  readonly cartTotalPriceLocator: Locator;

  // WISHLIST
  readonly wishListCountLocator: Locator;

  // MAIN NAVIGATION (BOTTOM HEADER)
  readonly mainNavLocator: Locator;
  readonly mainNavItemsLocator: Locator;
  readonly catMenuLocator: Locator;
  readonly catMenuItemsLocator: Locator;

  constructor(page: Page, isMobile: boolean = false) {
    this.page = page;

    // SALE POPUP
    this.salesPopupLocator = this.page.locator("#sales-booster-popup");
    this.closeSalesPopupButtonLocator =
      this.salesPopupLocator.locator(".close");

    // COOKIE NOTICE
    this.cookiePopupLocator = this.page.getByRole("dialog", {
      name: "Cookie Notice",
    });
    this.acceptCookiesButtonLocator = this.cookiePopupLocator.getByRole(
      "link",
      {
        name: "Ok",
        exact: true,
      }
    );

    // HEADER (IN CROSS-DEVICE)
    if (isMobile) {
      this.headerLocator = this.page.locator(".header-mobile-wrapper");
    } else {
      this.headerLocator = this.page.locator(".header-wrapper");
    }

    // TOP HEADER
    this.topHeaderLocator = this.headerLocator.locator(".header-top-wrapper");
    this.contactNumberTextLocator = this.topHeaderLocator.locator(
      "//*[contains(@class, 'et_element ') and ./i][1]"
    );
    this.addressTextLocator = this.topHeaderLocator.locator(
      "//*[contains(@class, 'et_element ') and ./i][2]"
    );
    this.loginOrSignupButtonLocator = this.topHeaderLocator.getByRole("link", {
      name: "Log in / Sign up",
    });
    this.socailListsLocator = this.topHeaderLocator.locator(".et-socials");
    this.socialItemLocator = this.socailListsLocator.getByRole("link");

    // MAIN HEADER
    this.mainHeaderLocator = this.headerLocator.locator(".header-main-wrapper");
    this.categoryMenuLocator = this.mainHeaderLocator.locator(
      "//select[@name='product_cat']"
    );
    this.searchInputLocator = this.mainHeaderLocator.getByRole("textbox", {
      name: "s",
    });
    this.searchButtonLocator = this.mainHeaderLocator.locator(
      "button.search-button"
    );

    // CART
    this.cartCountLocator = this.page.locator(
      ".header-wrapper span ~ .et-cart-quantity"
    );

    // CART POPUP
    this.productsInCartLocator = this.page
      .locator(".cart-widget-products")
      .getByRole("listitem");

    this.productTitleInCartLocator = this.page.locator(".product-title");
    this.cartTotalPriceLocator = this.page
      .locator(".header-wrapper")
      .locator(".big-coast");

    // WISHLIST
    this.wishListCountLocator = this.mainHeaderLocator.locator(
      "span ~ .et-wishlist-quantity"
    );

    // MAIN NAVIGATION (BOTTOM HEADER)
    this.mainNavLocator = this.headerLocator.locator(".header-bottom-wrapper");
    this.mainNavItemsLocator = this.mainNavLocator.getByRole("listitem");
    this.catMenuLocator = this.mainNavLocator.locator(".header-secondary-menu");
    this.catMenuItemsLocator = this.catMenuLocator.getByRole("link");
  }

  abstract goto(data?: any): Promise<void>;

  async closeSalesPopupIfVisible() {
    if (await this.closeSalesPopupButtonLocator.isVisible()) {
      await this.closeSalesPopupButtonLocator.click();
    }
  }

  async acceptCookiesIfVisible() {
    if (await this.acceptCookiesButtonLocator.isVisible()) {
      await this.acceptCookiesButtonLocator.click();
    }
  }

  getSocailLinkLocatorByName(socialName: string) {
    const socialLinkLocator = this.socialItemLocator.filter({
      hasText: socialName,
    });

    return socialLinkLocator;
  }

  getMainMenuItemLocatorByName(menuItemName: string) {
    const mainMenuItemLocator = this.mainNavItemsLocator.filter({
      hasText: menuItemName,
    });

    return mainMenuItemLocator;
  }

  getCategoryInMainMenu(category: Category) {
    const categoryLinkLocator = this.catMenuItemsLocator.filter({
      hasText: category.name,
    });

    return categoryLinkLocator;
  }

  async searchProduct(product: Product) {
    await this.categoryMenuLocator.selectOption({
      label: product.category?.name ?? CategoryConstants.ALL_CATEGORIES,
    });
    await this.searchInputLocator.fill(product.title);
    await this.searchButtonLocator.click();
  }

  async localeToMainCategoriesMenu() {
    await this.catMenuLocator.hover();
  }

  async navigateToCategoryPage(category: Category) {
    const categoryLinkLocator = this.catMenuItemsLocator.filter({
      hasText: category.name,
    });

    await categoryLinkLocator.click();
  }

  async navigateToPageInMainMenu(menuName: MainMenuItem) {
    await this.getMainMenuItemLocatorByName(menuName).click();
  }

  async getCartCount(): Promise<number> {
    await this.cartCountLocator.waitFor({ state: "attached" });

    if (!(await this.cartCountLocator.isVisible())) {
      await this.cartCountLocator.scrollIntoViewIfNeeded();
    }

    const countText = (await this.cartCountLocator.textContent()) ?? "";
    const count = extractNumbers(countText)[0] ?? 0;
    return count;
  }

  async getCartTotalPrice(): Promise<number> {
    const rawText = (await this.cartTotalPriceLocator.textContent()) ?? "";
    const totalPrice = extractNumbers(rawText)[0] ?? 0;

    return totalPrice;
  }

  async getProductsInCart(): Promise<Product[]> {
    await this.cartCountLocator.hover();
    await this.productsInCartLocator.waitFor({ state: "visible" });

    const productTitles = await this.productsInCartLocator
      .locator(this.productTitleInCartLocator)
      .allTextContents();

    return productTitles.map(
      (title) => new Product(title.trim().replace(/\s+/g, " "))
    );
  }

  async getWishlistCount() {
    const rawText = (await this.wishListCountLocator.textContent()) ?? "";

    return extractNumbers(rawText).shift() ?? 0;
  }
}
