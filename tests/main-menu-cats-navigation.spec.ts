import test from "@fixtures/common.fixture";
import { Category } from "@models/category.model";
import { DataHelper } from "@utils/data-helper";
import { expect } from "@playwright/test";
import { CategoryPage } from "@pages/category.page";

const categories = DataHelper.getDataset<string>("main-menu-cats");

test.describe("TC_03: Verify Main Menu Categories Navigate Correctly", async () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  for (const categoryName of categories) {
    const category = new Category(categoryName);

    test(`Verify Category '${category.name}' Is Present And  Navigate Correctly`, async ({
      homePage,
      page,
    }) => {
      // 1. Hover over "All departments" menu
      await homePage.localeToMainCategoriesMenu();

      // 2. Verify all main categories are present:
      expect.soft(homePage.getCategoryInMainMenu(category)).toBeVisible();

      // 3. Click each category and verify navigation
      await homePage.navigateToCategoryPage(category);
      const categoryPage = new CategoryPage(page);
      const categoryTitle = await categoryPage.getCategoryTitle();

      expect.soft(categoryTitle).toBe(category.name);
    });
  }
});
