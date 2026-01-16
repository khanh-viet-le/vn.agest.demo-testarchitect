import { Locator, Page } from "@playwright/test";
import { Category } from "@models/category.model";
import { RouteConstants } from "@constants/route.constants";
import { BasePage } from "./base.page";

export class CategoryPage extends BasePage {
  readonly categoryTitleLocator: Locator;

  constructor(page: Page) {
    super(page);
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
