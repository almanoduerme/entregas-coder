import fs from "fs";
import * as crypto from "crypto";
import path from "path";
import { ProductManager } from "./ProductManager";
import { baseDirectory } from "../../utils";
import { Cart } from "../../interfaces";

const productsFilePath = path.join(baseDirectory, "database/products.json");
const productManager = new ProductManager(productsFilePath);

export class CartManager {
  private cartsFilePath: string;

  constructor(cartsFilePath: string) {
    this.cartsFilePath = cartsFilePath;
  }

  private async readFile(): Promise<Cart[] | []> {
    if (fs.existsSync(this.cartsFilePath)) {
      return JSON.parse(await fs.promises.readFile(this.cartsFilePath, "utf-8"));
    } else {
      return [];
    }
  }

  private async writeFile(carts: Cart[]): Promise<void> {
    try {
      await fs.promises.writeFile(this.cartsFilePath, JSON.stringify(carts, null, 2), "utf-8");
    } catch (error) {
      throw new Error(`Error writing file: ${error}`);
    }
  }

  public async createCart(): Promise<Cart> {
    try {
      const carts: Cart[] = await this.readFile();

      const newCartId = crypto.randomBytes(16).toString("hex");
      const isCartExists: boolean = carts.some((cart) => cart.id === newCartId);

      if (isCartExists) {
        throw new Error("A cart with the same ID already exists");
      }

      const newCart: Cart = {
        id: newCartId,
        products: [],
      };

      carts.push(newCart);
      await this.writeFile(carts);

      return newCart;
    } catch (error) {
      throw new Error(`Error creating cart: ${error as string}`);
    }
  }
 
  public async getCarts(): Promise<Cart[] | []> {
    try {
      const carts: Cart[] = await this.readFile();
      return carts;
    } catch (error) {
      throw new Error(`Error getting carts: ${error}`);
    }
  }

  public async getCartById(id: string): Promise<Cart | undefined> {
    try {
      const carts: Cart[] = await this.readFile();
      const cart: Cart | undefined = carts.find((cart) => cart.id === id);
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error}`);
    }
  }

  public async addProductToCart(cartId: string, productId: string): Promise<Cart | undefined> {
    try {
      const carts: Cart[] = await this.readFile();
      const cart: Cart | undefined = carts.find((cart) => cart.id === cartId);
  
      if (!cart) {
        throw new Error('Cart not found');
      }
  
      const product = await productManager.getProductByID(productId);
  
      if (!product) {
        throw new Error('Product not found');
      }
  
      const existingProduct = cart.products.find((product) => product.id === productId);
  
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: product.id, quantity: 1 });
      }
  
      await this.writeFile(carts);
      return cart;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }
}
