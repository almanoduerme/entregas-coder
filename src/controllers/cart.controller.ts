import path from "path";
import { Request, Response } from "express";
import { Cart, ProductIncart } from "../interfaces";
import { CartManager, ProductManager } from "../managers";
import { baseDirectory } from "../utils";

const cartsFilePath = path.join(baseDirectory, "database/carts.json");
const cartManager = new CartManager(cartsFilePath);

const productsFilePath = path.join(baseDirectory, "database/products.json");
const productManager = new ProductManager(productsFilePath);

export class CartsController {
  public static async getCarts(req: Request, res: Response): Promise<void> {
    try {
      const carts: Cart[] | [] = await cartManager.getCarts();

      if (carts.length === 0) {
        res.status(404).json({ error: "Carts not found" });
        return;
      }

      res.status(200).json(carts);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async createCart(req: Request, res: Response): Promise<void> {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getCartById(req: Request, res: Response): Promise<void> {
    try {
      const { cid } = req.params;
      const cart: Cart | undefined = await cartManager.getCartById(cid);
      
      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      const products = cart.products;      
      const productsWithQuantity: ProductIncart[] = [];

      for (const product of products) {
        const productDetails = await productManager.getProductByID(product.id as string);
        productsWithQuantity.push({ ...product, ...productDetails, quantity: product.quantity });
      }

      res.status(200).json({ ...cart, products: productsWithQuantity });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;

      // Check if cart exists
      const cart: Cart | undefined = await cartManager.getCartById(cid);

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      // Check if product exists
      const product = await productManager.getProductByID(pid);

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      await cartManager.addProductToCart(cid, pid);
      res.status(200).json(`Product added to cart successfully!`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
