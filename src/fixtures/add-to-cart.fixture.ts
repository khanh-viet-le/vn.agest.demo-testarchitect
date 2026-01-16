import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home.page";
import { ProductPage } from "@pages/product.page";
import { ShopPage } from "@pages/shop.page";

type AddToCartFixtures = {
  productPage: ProductPage;
};

const test = base.extend<AddToCartFixtures>({
  productPage: async ({ page }, use) => {
    const homePage = new HomePage(page);

    // 1. Navigate to https://demo.testarchitect.com/
    await homePage.goto();

    // 2. Close popup notifications
    await homePage.closeSalesPopupIfVisible();

    // 3. Accept cookie notice
    await homePage.acceptCookiesIfVisible();

    // Product is in cart
    await homePage.navigateToPageInMainMenu("Shop");

    const shopPage = new ShopPage(page);
    await shopPage.selectFirstAvailableProduct();

    const productPage = new ProductPage(page);
    await productPage.addToCart();

    await use(productPage);
  },
});

export default test;
