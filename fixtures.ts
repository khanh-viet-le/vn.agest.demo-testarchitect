import { test as base } from "@playwright/test";
import { HomePage } from "@pages/home.page";
import { ShopPage } from "@pages/shop.page";
import { ProductPage } from "@pages/product.page";
import { CategoryPage } from "@pages/category.page";
import { CartPage } from "@pages/cart.page";
import { CheckoutPage } from "@pages/checkout.page";
import { LoginPage } from "@pages/login.page";
import { RegisterPage } from "@pages/register.page";
import { MyAccountPage } from "@pages/my-account.page";

type MyFixtures = {
  homePage: HomePage;
  shopPage: ShopPage;
  productPage: ProductPage;
  categoryPage: CategoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  loginPage: LoginPage;
  registerPage: RegisterPage;
  myAccountPage: MyAccountPage;
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
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  registerPage: async ({ page }, use) => {
    const registerPage = new RegisterPage(page);
    await use(registerPage);
  },
  myAccountPage: async ({ page }, use) => {
    const myAccountPage = new MyAccountPage(page);
    await use(myAccountPage);
  },
});

export default test;
