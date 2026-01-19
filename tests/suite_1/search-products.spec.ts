import test from "@fixtures/common.fixture";
import { Product } from "@models/product.model";
import { DataHelper } from "@utils/data-helper.util";
import { expect } from "@playwright/test";

const searchProducts = DataHelper.getDataset<Product>("search-products");

test.describe("TC_02: Verify Product Search Functionality Works", async () => {
  for (const searchProduct of searchProducts) {
    test(`Verify Product Search Functionality Works on search = '${searchProduct.title}'`, async ({
      homePage,
      page,
    }) => {
      // 1. Navigate to https://demo.testarchitect.com/
      // 2. Close any popup notifications if present
      // 3. Accept cookie notice if present.

      // 4. Locate the search bar in the header
      // 5. Click on the category dropdown
      // 6. Select "All categories"
      // 7. Enter "camera" in the search field
      // 8. Click the search button
      await homePage.searchProduct(searchProduct);
      const matchedProducts = await homePage.getProductList();

      // 9. Observe search results page
      // - Search results should load
      expect.soft(matchedProducts.length).toBeGreaterThan(0);

      // - URL should contain search term "s=product.title"
      await expect.soft(page).toHaveURL(new RegExp(`s=${searchProduct.title}`));

      // - Products related to "product.title" should be displayed
      const matchedCount = matchedProducts.filter((product) => {
        return product.title
          .toLowerCase()
          .includes(searchProduct.title.toLowerCase());
      }).length;

      expect(matchedCount).toEqual(matchedProducts.length);
    });
  }
});
