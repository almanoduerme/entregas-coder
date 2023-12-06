import path from "path";
import { Request, Response } from "express";
import { Cart, ProductIncart } from "../interfaces";
import { CartManager, ProductManager } from "../daos/managers";
import { baseDirectory } from "../utils";
import { Cart as CartModelMongoDB } from "../daos/models/carts.model";
import { Product as ProductModelMongoDB } from "../daos/models/product.model";
import mongoose from "mongoose";

const cartsFilePath = path.join(baseDirectory, "database/carts.json");
const cartManager = new CartManager(cartsFilePath);

const productsFilePath = path.join(baseDirectory, "database/products.json");
const productManager = new ProductManager(productsFilePath);

export class CartsController {
  public static async getCarts(req: Request, res: Response): Promise<void> {
    try {
      // const carts: Cart[] | [] = await cartManager.getCarts();
      const carts: Cart[] | [] = await CartModelMongoDB.find().lean();

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
      // const newCart = await cartManager.createCart();
      const newCart = await CartModelMongoDB.create({ products: [] });
      res.status(201).json(newCart);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async getCartById(req: Request, res: Response): Promise<void> {
    try {
      const { cid } = req.params;

      if (mongoose.Types.ObjectId.isValid(cid) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      // const cart: Cart | undefined = await cartManager.getCartById(cid);
      const cart = await CartModelMongoDB.findById(cid).lean();
      
      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      const products = cart.products;      
      const productsWithQuantity: ProductIncart[] = [];

      for (const product of products) {
        // const productDetails = await productManager.getProductByID(product.id as string);
        const productDetails = await ProductModelMongoDB.findById(product.id).lean();
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
      // const cart: Cart | undefined = await cartManager.getCartById(cid);
      const cart = await CartModelMongoDB.findById(cid).lean();

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      // Check if product exists
      // const product = await productManager.getProductByID(pid);
      const product = await ProductModelMongoDB.findById(pid).lean();

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // await cartManager.addProductToCart(cid, pid);
      await CartModelMongoDB.findByIdAndUpdate(cid, { $push: { products: { id: pid, quantity: 1 } } });
      res.status(200).json(`Product added to cart successfully!`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
