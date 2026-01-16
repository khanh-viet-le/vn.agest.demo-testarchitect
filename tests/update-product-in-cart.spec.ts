import test from "@fixtures/common.fixture";
import { CartPage } from "@pages/cart.page";
import { ProductPage } from "@pages/product.page";
import { ShopPage } from "@pages/shop.page";
import { expect } from "@playwright/test";

test.beforeEach(async ({ homePage, page }) => {
  // Product is in cart
  await homePage.navigateToPageInMainMenu("Shop");
  const shopPage = new ShopPage(page);
  await shopPage.selectFirstAvailableProduct();
  const productPage = new ProductPage(page);
  await productPage.addToCart();
});

test("TC_05: Verify Product Quantity Can Be Updated in Cart", async ({
  homePage,
  page,
}) => {
  // 1. Navigate to Cart page
  await homePage.navigateToCartPage();
  const cartPage = new CartPage(page);

  const oldCartTotal = await cartPage.getCartTotal();
  const updatedQuantity = 2;

  // 2. Locate quantity field
  // 3. Change quantity to 2
  // 4. Click "Update Cart" button
  await cartPage.updateFirstAvailableProductQuantity(updatedQuantity);

  // 5. Verify cart updates
  // - update message should appear
  expect(cartPage.messageLocator).toHaveText(/Cart updated/);

  const newQuantity = await cartPage.getFirstAvailableProductQuantity();
  const newCartTotal = await cartPage.getCartTotal();

  // - Quantity should update
  expect.soft(newQuantity).toBe(updatedQuantity);

  // - Cart total should recalculate
  expect.soft(newCartTotal).toBe(oldCartTotal * updatedQuantity);
});
