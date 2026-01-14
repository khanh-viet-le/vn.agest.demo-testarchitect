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
  expect
    .soft(
      productsInCart.find((product) => product.title === shownProduct.title)
    )
    .toBeTruthy();

  // - Cart count should increase
  const newCartCount = await productPage.getCartCount();
  expect.soft(newCartCount).toBe(oldCartCount + 1);

  // - Cart total should update
  const newCartTotalPrice = await productPage.getCartTotalPrice();
  expect.soft(newCartTotalPrice).toBe(shownProduct.price);

  // - Success message should appear
  expect
    .soft(await productPage.getMessageStatus())
    .toBe(MessageStatusConstants.SUCCESS);
});
