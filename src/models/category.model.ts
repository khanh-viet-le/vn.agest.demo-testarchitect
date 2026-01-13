import { Product } from "./product.model";

export class Category {
  private _name: string;
  private _products: Product[];

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

  constructor(name: string = "", products: Product[] = []) {
    this._name = name;
    this._products = products;
  }
}
