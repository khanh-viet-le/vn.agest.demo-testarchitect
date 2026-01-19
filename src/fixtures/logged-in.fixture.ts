import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home.page";
import { DataHelper } from "@utils/data-helper.util";
import { ICredentials } from "@interfaces/credentials.interface";
import { LoginPage } from "@pages/login.page";

type LoggedInFixtures = {
  homePage: HomePage;
};

const validCredentials =
  DataHelper.getDataset<ICredentials>("valid-credentials").shift();

if (!validCredentials) {
  throw new Error(
    "There is no valid credentials to login in logged in fixture"
  );
}

const test = base.extend<LoggedInFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.closeSalesPopupIfVisible();
    await homePage.acceptCookiesIfVisible();

    await homePage.navigateToAccountPage();
    const loginPage = new LoginPage(page);

    await loginPage.login(validCredentials.username, validCredentials.password);
    await homePage.navigateToPageInMainMenu("Home");
    await use(homePage);
  },
});

export default test;
