import test from "@/fixtures";
import { MessageStatusConstants } from "@constants/message-status.constants";
import { expect } from "@playwright/test";

test("TC_04: Verify Product Can Be Added to Shopping Cart", async ({
  shopPage,
  homePage,
}) => {
  // 1. Navigate to Shop page
  await shopPage.goto();
  await homePage.closeSalesPopupIfVisible();
  await homePage.acceptCookiesIfVisible();

  // 2. Select any available product
  const productPage = await shopPage.selectFirstAvailableProduct();
  const oldCartCount = await productPage.getCartCount();
  const shownProduct = await productPage.getProduct();

  // 3. Click "Add to Cart" button
  await productPage.addToCart();

  // 4. Verify cart notification
  // 5. Check cart icon update
  // - Product should be added to cart
  const productsInCart = await productPage.getProductsInCart();
  expect.soft(productsInCart).toContainEqual(shownProduct);

  // - Cart count should increase
  // - Cart total should update
  const newCartCount = await productPage.getCartCount();
  expect.soft(newCartCount).toBe(oldCartCount + 1);

  // - Success message should appear
  expect
    .soft(await productPage.getMessageStatus())
    .toBe(MessageStatusConstants.SUCCESS);
});
