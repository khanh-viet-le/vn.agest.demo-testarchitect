import test from "@/fixtures";
import { Product } from "@/src/models/product.model";
import { getDataset } from "@/src/utils/data-helper";
import { expect } from "@playwright/test";

const searchProducts = getDataset<Product>("search-products");

test.describe("TC_02: Verify Product Search Functionality Works", async () => {
  for (const searchProduct of searchProducts) {
    test(`Verify Product Search Functionality Works on search = '${searchProduct.title}'`, async ({
      homePage,
      page,
    }) => {
      // 1. Navigate to https://demo.testarchitect.com/
      await homePage.goto();

      // 2. Close any popup notifications if present
      await homePage.closeSalesPopupIfVisible();

      // 3. Accept cookie notice if present.
      await homePage.acceptCookiesIfVisible();

      // 4. Locate the search bar in the header
      // 5. Click on the category dropdown
      // 6. Select "All categories"
      // 7. Enter "camera" in the search field
      // 8. Click the search button
      const matchedProducts = await homePage.searchProduct(searchProduct);

      // 9. Observe search results page
      // - Search results should load
      // - URL should contain search term "s=product.title"
      await expect.soft(page).toHaveURL(new RegExp(`s=${searchProduct.title}`));

      // - Products related to "product.title" should be displayed
      const matchedCount = matchedProducts.filter((product) => {
        return product.title.includes(searchProduct.title);
      }).length;

      expect(matchedCount).toEqual(matchedProducts.length);
    });
  }
});
