import { Request, Response } from "express";
import { Cart, CartReturn } from "../interfaces";
import { Cart as CartModelMongoDB } from "../daos/models/carts/carts.model";
import { Product as ProductModelMongoDB } from "../daos/models/product/product.model";
import mongoose from "mongoose";

export class CartsController {
  public static async getCarts(req: Request, res: Response): Promise<void> {
    try {
      const carts: Cart[] | [] = await CartModelMongoDB.find();

      if (carts.length === 0) {
        res.status(404).json({ error: "Carts not found" });
        return;
      }

      const cartsWithProducts = await CartModelMongoDB.find();

      res.status(200).json(cartsWithProducts);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } 

  public static async createCart(req: Request, res: Response): Promise<void> {
    try {
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

      const cart = await CartModelMongoDB.findById(cid).lean();

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }      

      res.status(200).send(cart);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }}  

  public static async addProductToCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;
  
      const cart: CartReturn | null = await CartModelMongoDB.findById(cid).lean();
  
      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }
  
      const product = await ProductModelMongoDB.findById(pid).lean();
  
      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }
  
      const productExists = cart.products.find((product) => JSON.stringify(product._id) === JSON.stringify(pid));
  
      // If product exists, increase quantity
      if (productExists) {
        const productIndex = cart.products.findIndex((product) => JSON.stringify(product.product) === JSON.stringify(pid));
        cart.products[productIndex].quantity += 1;
        await CartModelMongoDB.findOneAndUpdate({ _id: cid }, cart);
        res.status(200).json("Product added to cart successfully!");
        return;
      }
  
      const newProduct = { product: pid, quantity: 1 };
      await CartModelMongoDB.findOneAndUpdate({ _id: cid }, { ...cart, products: [...cart.products, newProduct] });
      res.status(200).json("Product added to cart successfully!");

    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
    
  public static async removeProductFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;

      if (mongoose.Types.ObjectId.isValid(cid) === false || mongoose.Types.ObjectId.isValid(pid) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      // Check if cart exists
      const cart: CartReturn | null = await CartModelMongoDB.findById(cid).lean();

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      // Check if product exists
      const product = await ProductModelMongoDB.findById(pid).lean();

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      // Check if product already exists in cart
      const productExists = cart.products.find((product) => JSON.stringify(product._id) === JSON.stringify(pid));

      // If product exists, decrease quantity
      if (productExists) {
        const productIndex = cart.products.findIndex((product) => JSON.stringify(product._id) === JSON.stringify(pid));
        cart.products[productIndex].quantity -= 1;

        if (cart.products[productIndex].quantity === 0) {
          cart.products.splice(productIndex, 1);
        }

        await CartModelMongoDB.findByIdAndUpdate(cid, cart);
        res.status(200).json(`Product removed from cart successfully!`);
        return;
      }

      res.status(404).json({ error: "Product not found in cart" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid } = req.params;
      const { products } = req.body;

      if (mongoose.Types.ObjectId.isValid(cid) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const cart: CartReturn | null = await CartModelMongoDB.findById(cid);

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      await CartModelMongoDB.findByIdAndUpdate(cid, { ...cart, products });
      res.status(200).json(`Cart updated successfully!`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async updateProductInCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;

      if (mongoose.Types.ObjectId.isValid(cid) === false || mongoose.Types.ObjectId.isValid(pid) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const cart: CartReturn | null = await CartModelMongoDB.findById(cid);

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      const product = cart.products.find((product) => JSON.stringify(product._id) === JSON.stringify(pid));

      if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
      }

      const productIndex = cart.products.findIndex((product) => JSON.stringify(product._id) === JSON.stringify(pid));
      cart.products[productIndex].quantity = quantity;

      await CartModelMongoDB.findByIdAndUpdate(cid, cart);
      res.status(200).json(`Product updated successfully!`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  public static async deleteAllProductsFromCart(req: Request, res: Response): Promise<void> {
    try {
      const { cid } = req.params;

      if (mongoose.Types.ObjectId.isValid(cid) === false) {
        res.status(400).json({ error: "Invalid ID" });
        return;
      }

      const cart: CartReturn | null = await CartModelMongoDB.findById(cid);

      if (!cart) {
        res.status(404).json({ error: "Cart not found" });
        return;
      }

      await CartModelMongoDB.findByIdAndUpdate(cid, { ...cart, products: [] });
      res.status(200).json(`Cart updated successfully!`);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
