import { Category } from "@models/category.model";

export class Product {
  private _title: string;
  private _slug: string;
  private _category?: Category;

  get title() {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get slug(): string {
    return this._slug;
  }

  set slug(val: string) {
    this._slug = val;
  }

  get category(): Category | undefined {
    return this._category;
  }

  set category(val: Category) {
    this._category = val;
  }

  constructor(title: string, category?: Category, slug: string = "") {
    this._title = title;
    this._category = category;
    this._slug = slug;
  }

  /**
   * Checks if this product is equal to another based on title
   * @param other - The other Product to compare with.
   * @returns True if titles match, false otherwise.
   */
  equals(other: Product): boolean {
    return this.title === other.title;
  }
}
