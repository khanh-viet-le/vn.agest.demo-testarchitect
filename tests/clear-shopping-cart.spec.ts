import test from "@/fixtures";
import { ICredentials } from "@/src/interfaces/credentials.interface";
import { getDataset } from "@/src/utils/data-helper";
import { expect } from "@playwright/test";

const validCredentials = getDataset<ICredentials>("valid-credentials").shift();

if (!validCredentials) {
  throw new Error("There is no valid credentials");
}

// User added the items into cart
test.beforeEach(async ({ shopPage, homePage, checkoutPage }) => {
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  const productPage = await shopPage.selectFirstAvailableProduct();
  await productPage.addToCart();

  await checkoutPage.goto();
});

test("TC_07: Verify Users Can Clear the Shopping Cart", async ({
  loginPage,
  cartPage,
}) => {
  // 1. Open browser and go to https://demo.testarchitect.com/
  // 2. Login with valid credentials
  await loginPage.goto();
  await loginPage.login(validCredentials.username, validCredentials.password);

  // 3. Go to Shopping cart page
  await cartPage.goto();

  // 4. Verify items show in table
  expect.soft(await cartPage.getFirstAvailableProductQuantity()).toBe(1);

  // 5. Click on Clear shopping cart
  await cartPage.clearCart();

  // 6. Verify empty cart page displays
  // YOUR SHOPPING CART IS EMPTY displays
  expect(await cartPage.isCartEmpty()).toBeTruthy();
});
