import { Product } from "../interfaces/product.interface";

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductValidationError";
  }

  public static validateIfProductExists(products: Product[], code: string): boolean {
    if (products.some((p) => p.code === code)) {
      throw new ProductValidationError("Product already exists.");
    }

    return false;
  }

  public static validateFields(product: Product): void {
    const { title, description, price, thumbnail, code, stock } = product as Product;

    if (![title, description, price, thumbnail, code, stock].every(Boolean)) {
      throw new ProductValidationError("Missing data.");
    }
  }
}