import test from "@fixtures/common.fixture";
import { MessageStatusConstants } from "@constants/message-status.constants";
import { expect } from "@playwright/test";
import { ShopPage } from "@pages/shop.page";
import { ProductPage } from "@pages/product.page";

test(
  "TC_04: Verify Product Can Be Added to Shopping Cart",
  {
    tag: ["@cart", "@product"],
    annotation: {
      type: "test",
      description: "Here is an annotation test",
    },
  },
  async ({ homePage, page }) => {
    // 1. Navigate to Shop page
    await homePage.navigateToPageInMainMenu("Shop");
    const shopPage = new ShopPage(page);

    // 2. Select any available product
    await shopPage.selectFirstAvailableProduct();
    const productPage = new ProductPage(page);
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
        productsInCart.find((product) => product.title === shownProduct.title),
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
  },
);
