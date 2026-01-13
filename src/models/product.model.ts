import { Category } from "./category.model";

export class Product {
  private _title: string;
  private _category?: Category;

  get title() {
    return this._title;
  }

  set title(val: string) {
    this._title = val;
  }

  get category(): Category | undefined {
    return this._category;
  }

  set category(val: Category) {
    this._category = val;
  }

  constructor(title: string, category?: Category) {
    this._title = title;
    this._category = category;
  }
}
