import test from "@/fixtures";
import { expect } from "@playwright/test";

test.beforeEach(async ({ shopPage, homePage }) => {
  // Product is in cart
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  const productPage = await shopPage.selectFirstAvailableProduct();
  await productPage.addToCart();
});

test("TC_05: Verify Product Quantity Can Be Updated in Cart", async ({
  cartPage,
  productPage,
}) => {
  // 1. Navigate to Cart page
  await cartPage.goto();

  const oldQuantity = await cartPage.getFirstAvailableProductQuantity();
  const oldCartCount = await productPage.getCartCount();
  const updatedQuantity = 2;

  // 2. Locate quantity field
  // 3. Change quantity to 2
  // 4. Click "Update Cart" button
  await cartPage.updateFirstAvailableProductQuantity(updatedQuantity);

  // 5. Verify cart updates
  // - update message should appear
  expect((await cartPage.getMessage()).length).toBeGreaterThan(0);

  const newQuantity = await cartPage.getFirstAvailableProductQuantity();
  const newCartCount = await productPage.getCartCount();

  // - Quantity should update
  expect.soft(newQuantity).toBe(updatedQuantity);

  // - Cart total should recalculate
  expect.soft(newCartCount).toBe(oldCartCount - oldQuantity + newQuantity);
});
