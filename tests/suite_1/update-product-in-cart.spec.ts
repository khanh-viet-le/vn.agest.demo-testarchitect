import addedToCartTest from "@fixtures/add-to-cart.fixture";
import { CartPage } from "@pages/cart.page";
import { expect } from "@playwright/test";

// Product is in cart
const test = addedToCartTest;

test("TC_05: Verify Product Quantity Can Be Updated in Cart", async ({
  productPage,
  page,
}) => {
  // 1. Navigate to Cart page
  await productPage.navigateToCartPage();
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
