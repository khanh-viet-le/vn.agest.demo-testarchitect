import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home.page";
import { ShopPage } from "@pages/shop.page";
import { ProductPage } from "@pages/product.page";
import { CategoryPage } from "@pages/category.page";

type MyFixtures = {
  homePage: HomePage;
  shopPage: ShopPage;
  productPage: ProductPage;
  categoryPage: CategoryPage;
};

const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },
  shopPage: async ({ page }, use) => {
    const shopPage = new ShopPage(page);
    await use(shopPage);
  },
  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },
  categoryPage: async ({ page }, use) => {
    const categoryPage = new CategoryPage(page);
    await use(categoryPage);
  },
});

export default test;
