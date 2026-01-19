import loggedInTest from "@fixtures/logged-in.fixture";
import { ShopPage } from "@pages/shop.page";
import { WishlistPage } from "@pages/wishlist.page";
import { expect } from "@playwright/test";

// User is logged in
const test = loggedInTest;

test("TC_10: Verify Product Can Be Added to Wishlist", async ({
  homePage,
  page,
}) => {
  // 1. Navigate to Shop page
  await homePage.navigateToPageInMainMenu("Shop");
  const shopPage = new ShopPage(page);
  const oldWishlistCount = await shopPage.getWishlistCount();

  // 2. Find a product
  // 3. Click wishlist icon
  const selectedProduct = await shopPage.addFistAvailableProductToWishList();

  // 4. Verify wishlist update
  // - Product should be added to wishlist
  const products = await shopPage.getProductsInWishlist();

  expect
    .soft(products.map((product) => product.title))
    .toContain(selectedProduct.title);

  // - Wishlist count should increase
  const newWishlistCount = await shopPage.getWishlistCount();
  expect.soft(newWishlistCount).toBe(oldWishlistCount + 1);

  // 5. Navigate to Wishlist page
  const wishlistPage = new WishlistPage(page);
  await wishlistPage.goto();

  // - Product should appear in wishlist page
  const productsInWishlist = await wishlistPage.getProducts();
  expect(productsInWishlist.map((product) => product.title)).toContainEqual(
    selectedProduct.title
  );
});
