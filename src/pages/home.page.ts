import { Locator, Page } from "@playwright/test";

export class HomePage {
  private static ROUTE = "/";
  private page: Page;
  private salesPopupLocator: Locator;
  private closeSalesPopupButtonLocator: Locator;
  private cookiePopupLocator: Locator;
  private acceptCookiesButtonLocator: Locator;
  private headerLocator: Locator;
  private topHeaderLocator: Locator;
  private contactNumberTextLocator: Locator;
  private addressTextLocator: Locator;
  private loginOrSignupButtonLocator: Locator;
  private mainNavLocator: Locator;
  private mainNavItemsLocator: Locator;
  private socailListsLocator: Locator;
  private socialItemLocator: Locator;

  constructor(page: Page, isMobile: boolean = false) {
    this.page = page;

    // SALE POPUP
    this.salesPopupLocator = this.page.locator("#sales-booster-popup");
    this.closeSalesPopupButtonLocator = this.salesPopupLocator.locator(
      "//*[contains(@class, 'close')]"
    );

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
      this.headerLocator = this.page.locator(
        "//*[contains(@class , 'header-mobile-wrapper')]"
      );
    } else {
      this.headerLocator = this.page.locator(
        "//*[contains(@class , 'header-wrapper')]"
      );
    }

    //   TOP HEADER
    this.topHeaderLocator = this.headerLocator.locator(
      "//*[contains(@class , 'header-top-wrapper ')]"
    );
    this.contactNumberTextLocator = this.topHeaderLocator.locator(
      "//*[contains(@class, 'et_element ') and ./i][1]"
    );
    this.addressTextLocator = this.topHeaderLocator.locator(
      "//*[contains(@class, 'et_element ') and ./i][2]"
    );
    this.loginOrSignupButtonLocator = this.topHeaderLocator.getByRole("link", {
      name: "Log in / Sign up",
    });
    this.socailListsLocator = this.topHeaderLocator.locator(
      "//*[contains(@class , 'et-socials ')]"
    );
    this.socialItemLocator = this.socailListsLocator.getByRole("link");

    // MAIN NAVIGATION (BOTTOM HEADER)
    this.mainNavLocator = this.headerLocator.locator(
      "//*[contains(@class , 'header-bottom-wrapper ')]"
    );
    this.mainNavItemsLocator = this.mainNavLocator.getByRole("listitem");
  }

  async goto() {
    await this.page.goto(HomePage.ROUTE);
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
}
