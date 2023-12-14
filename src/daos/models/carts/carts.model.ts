import { Schema, model } from "mongoose";

const cartsSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product"
        },
        quantity: Number,
      },
    ],
  },
});

cartsSchema.pre("findOne", function () {
  this.populate({ path: "products.product", model: 'Product' });
});

cartsSchema.pre("find", function () {
  this.populate({ path: "products.product", model: 'Product' });
});

const Cart = model("Carts", cartsSchema);
export { Cart };