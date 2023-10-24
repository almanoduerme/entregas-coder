import { Product } from "./interfaces/product.interface";
import { ProductValidationError } from "./validators";

export class ProductManager {
  private products: Product[];

  constructor(initialProducts: Product[] = []) {
    this.products = initialProducts;
  }

  private autoincrementId(): number {
    return this.products.length + 1;
  }

  public addProduct(product: Product): void {
    ProductValidationError.validateFields(product);

    if (ProductValidationError.validateIfProductExists(this.products, product.code)) {
      throw new Error("Product already exists.");
    }

    const productToAdd: Product = {
      id: this.autoincrementId(),
      ...product,
    };

    this.products.push(productToAdd);
  }

  public getProducts(): Product[] {
    return this.products;
  }

  public getProductById(id: number): Product {
    const product = this.products.find((p) => p.id === id);

    if (!product) {
      throw new Error("Product not found.");
    }

    return product;
  }
}
