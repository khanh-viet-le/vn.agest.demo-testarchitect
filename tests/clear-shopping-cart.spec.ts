import addedToCartTest from "@fixtures/add-to-cart.fixture";
import { ICredentials } from "@interfaces/credentials.interface";
import { DataHelper } from "@utils/data-helper.util";
import { expect } from "@playwright/test";
import { LoginPage } from "@pages/login.page";
import { MyAccountPage } from "@pages/my-account.page";
import { CartPage } from "@pages/cart.page";

const validCredentials =
  DataHelper.getDataset<ICredentials>("valid-credentials").shift();

if (!validCredentials) {
  throw new Error("There is no valid credentials");
}

// User added the items into cart
const test = addedToCartTest;

test("TC_07: Verify Users Can Clear the Shopping Cart", async ({ page }) => {
  // 1. Open browser and go to https://demo.testarchitect.com/
  // 2. Login with valid credentials
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(validCredentials.username, validCredentials.password);
  const myAccountPage = new MyAccountPage(page);

  // 3. Go to Shopping cart page
  myAccountPage.navigateToCartPage();
  const cartPage = new CartPage(page);

  // 4. Verify items show in table
  expect.soft(await cartPage.getFirstAvailableProductQuantity()).toBe(1);

  // 5. Click on Clear shopping cart
  await cartPage.clearCart();

  // 6. Verify empty cart page displays
  // YOUR SHOPPING CART IS EMPTY displays
  expect(await cartPage.cartEmptyTitleLocator).toHaveText(
    new RegExp("YOUR SHOPPING CART IS EMPTY", "i")
  );
});
