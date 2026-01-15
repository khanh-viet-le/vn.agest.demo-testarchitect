import { Locator, Page } from "@playwright/test";
import { Category } from "@models/category.model";
import { RouteConstants } from "@constants/route.constants";

export class CategoryPage {
  private page: Page;
  private categoryTitleLocator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryTitleLocator = this.page
      .getByRole("heading", {
        level: 1,
      })
      .and(this.page.locator(".title"));
  }

  async goto(category: Category) {
    await this.page.goto(`${RouteConstants.CATEGORY}/${category.slug}`);
  }

  async getCategoryTitle(): Promise<string> {
    return (await this.categoryTitleLocator.textContent()) ?? "";
  }
}
