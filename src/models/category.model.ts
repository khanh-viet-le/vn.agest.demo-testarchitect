import { Product } from "@models/product.model";

export class Category {
  private _name: string;
  private _products: Product[];
  private _slug: string;

  get slug() {
    return this._slug;
  }

  set slug(val: string) {
    this._slug = val;
  }

  get name() {
    return this._name;
  }

  set name(val: string) {
    this._name = val;
  }

  get products() {
    return this._products;
  }

  set products(val: Product[]) {
    this._products = val;
  }

  constructor(name: string = "", products: Product[] = [], slug: string = "") {
    this._name = name;
    this._products = products;
    this._slug = slug;
  }
}
