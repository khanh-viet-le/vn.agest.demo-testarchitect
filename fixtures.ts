import { HomePage } from "@pages/home.page";
import pwT, { test as base } from "@playwright/test";

type MyFixtures = {
  homePage: HomePage;
};

const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
});

export default test;
