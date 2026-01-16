import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home.page";

type CommonFixtures = {
  homePage: HomePage;
};

const test = base.extend<CommonFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://demo.testarchitect.com/
    await homePage.goto();

    // 2. Close popup notifications
    await homePage.closeSalesPopupIfVisible();

    // 3. Accept cookie notice
    await homePage.acceptCookiesIfVisible();

    await use(homePage);
  },
});

export default test;
