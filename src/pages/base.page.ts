import { CategoryConstants } from "@constants/category.constant";
import { Category } from "@models/category.model";
import { Product } from "@models/product.model";
import { Locator, Page } from "@playwright/test";
import { CategoryPage } from "@pages/category.page";

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

    // MAIN NAVIGATION (BOTTOM HEADER)
    this.mainNavLocator = this.headerLocator.locator(".header-bottom-wrapper");
    this.mainNavItemsLocator = this.mainNavLocator.getByRole("listitem");
    this.catMenuLocator = this.mainNavLocator.locator(".header-secondary-menu");
    this.catMenuItemsLocator = this.catMenuLocator.getByRole("link");
  }

  abstract goto(): Promise<void>;

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

  async navigateToCategoryPage(category: Category): Promise<CategoryPage> {
    const categoryLinkLocator = this.catMenuItemsLocator.filter({
      hasText: category.name,
    });

    await categoryLinkLocator.click();

    return new CategoryPage(this.page);
  }

  async navigateToPageInMainMenu<P>(
    menuName: string,
    constructor: (page: Page) => P
  ): Promise<P> {
    if (!this.getMainMenuItemLocatorByName(menuName).isVisible()) {
      throw new Error(
        `Menu item '${menuName}' not found in the main navigation`
      );
    }
    await this.getMainMenuItemLocatorByName(menuName).click();
    return constructor(this.page);
  }
}
