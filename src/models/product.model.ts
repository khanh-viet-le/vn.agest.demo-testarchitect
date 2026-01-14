import { Category } from "@models/category.model";

export class Product {
  private _title: string;
  private _slug: string;
  private _price: number;
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

  get price() {
    return this._price;
  }

  set price(val: number) {
    this._price = Number.isNaN(val) ? 0 : val;
  }

  constructor(
    title: string,
    category?: Category,
    slug: string = "",
    price: number = 0
  ) {
    this._title = title;
    this._category = category;
    this._slug = slug;
    this._price = price;
  }
}
