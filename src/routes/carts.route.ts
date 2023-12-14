import { Router } from "express";
import { CartsController } from "../controllers/cart.controller";

const cartsRouter = Router();

cartsRouter.get("/", CartsController.getCarts);
cartsRouter.post("/", CartsController.createCart);
cartsRouter.get("/:cid", CartsController.getCartById);
cartsRouter.post("/:cid/products/:pid", CartsController.addProductToCart);
cartsRouter.delete("/:cid/products/:pid", CartsController.removeProductFromCart);
cartsRouter.put("/:cid", CartsController.updateCart);
cartsRouter.put("/cid/products/:pid", CartsController.updateProductInCart);
cartsRouter.delete("/:cid", CartsController.deleteAllProductsFromCart);

export default cartsRouter;