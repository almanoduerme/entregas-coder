import { Router } from "express";
import { CartsController } from "../controllers/cart.controller";

const cartsRouter = Router();

cartsRouter.get("/", CartsController.getCarts);
cartsRouter.post("/", CartsController.createCart);
cartsRouter.get("/:cid", CartsController.getCartById);
cartsRouter.post("/:cid/products/:pid", CartsController.addProductToCart);

export default cartsRouter;