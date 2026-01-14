import { Locator, Page } from "@playwright/test";
import { Product } from "@models/product.model";
import { CategoryConstants } from "@constants/category.constant";
import { Category } from "@models/category.model";
import { RouteConstants } from "@constants/route.constants";
import { CategoryPage } from "./category.page";

export class HomePage {
  private page: Page;

  // SALE POPUP
  private salesPopupLocator: Locator;
  private closeSalesPopupButtonLocator: Locator;

  // COOKIE NOTICE
  private cookiePopupLocator: Locator;
  private acceptCookiesButtonLocator: Locator;

  // HEADER (IN CROSS-DEVICE)
  private headerLocator: Locator;

  // TOP HEADER
  private topHeaderLocator: Locator;
  private contactNumberTextLocator: Locator;
  private addressTextLocator: Locator;
  private loginOrSignupButtonLocator: Locator;
  private socailListsLocator: Locator;
  private socialItemLocator: Locator;

  // MAIN HEADER
  private mainHeaderLocator: Locator;
  private categoryMenuLocator: Locator;
  private searchInputLocator: Locator;
  private searchButtonLocator: Locator;

  // MAIN NAVIGATION (BOTTOM HEADER)
  private mainNavLocator: Locator;
  private mainNavItemsLocator: Locator;
  private catMenuLocator: Locator;
  private catMenuItemsLocator: Locator;

  // PRODUCT LIST
  private productItemLocator: Locator;
  private productCategoryLocator: Locator;
  private productTitleLocator: Locator;

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

    // PRODUCT LIST
    this.productItemLocator = this.page
      .locator(".products")
      .locator(".product");
    this.productCategoryLocator = this.page
      .locator(".products-page-cats")
      .getByRole("link");
    this.productTitleLocator = this.page
      .locator(".product-title")
      .getByRole("link");
  }

  async goto() {
    await this.page.goto(RouteConstants.HOME);
  }

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

  async getPhoneNumberText() {
    return await this.contactNumberTextLocator.textContent();
  }

  async getAddressText() {
    return await this.addressTextLocator.textContent();
  }

  async isLoginOrSignupButtonVisible() {
    return await this.loginOrSignupButtonLocator.isVisible();
  }

  async isLoginOrSignupButtonClickable() {
    return await this.loginOrSignupButtonLocator.isEnabled();
  }

  private getSocailLinkLocatorByName(socialName: string) {
    const socialLinkLocator = this.socialItemLocator.filter({
      hasText: socialName,
    });

    return socialLinkLocator;
  }

  async isSocailLinkVisible(socialName: string) {
    const socialLinkLocator = this.getSocailLinkLocatorByName(socialName);
    return await socialLinkLocator.isVisible();
  }

  async isSocailLinkClickable(socialName: string) {
    const socialLinkLocator = this.getSocailLinkLocatorByName(socialName);
    return await socialLinkLocator.isEnabled();
  }

  private getMainMenuItemLocatorByName(menuItemName: string) {
    const mainMenuItemLocator = this.mainNavItemsLocator.filter({
      hasText: menuItemName,
    });

    return mainMenuItemLocator;
  }

  async isMainMenuItemVisible(menuItemName: string) {
    const mainMenuItemLocator = this.getMainMenuItemLocatorByName(menuItemName);
    return await mainMenuItemLocator.isVisible();
  }

  async isMainMenuItemClickable(menuItemName: string) {
    const mainMenuItemLocator = this.getMainMenuItemLocatorByName(menuItemName);
    return await mainMenuItemLocator.isEnabled();
  }

  async searchProduct(product: Product): Promise<Product[]> {
    await this.categoryMenuLocator.selectOption({
      label: product.category?.name ?? CategoryConstants.ALL_CATEGORIES,
    });
    await this.searchInputLocator.fill(product.title);
    await this.searchButtonLocator.click();

    return await this.getProductList();
  }

  async getProductList(): Promise<Product[]> {
    await this.productItemLocator.first().waitFor({ timeout: 10000 });
    const productItems = await this.productItemLocator.all();

    const products: Product[] = [];

    for (const item of productItems) {
      const title =
        (await item.locator(this.productTitleLocator).textContent()) ?? "";
      const categoryName = await item
        .locator(this.productCategoryLocator)
        .textContent();

      const category = categoryName
        ? new Category(categoryName.trim())
        : undefined;
      const product = new Product(title, category);

      products.push(product);
    }

    return products;
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

  async isCategoryPresentInMainMenu(category: Category): Promise<boolean> {
    const categoryLinkLocator = this.catMenuItemsLocator.filter({
      hasText: category.name,
    });

    return await categoryLinkLocator.isVisible();
  }
}
