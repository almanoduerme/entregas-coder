import { Schema, model } from 'mongoose'

const cartsSchema = new Schema({
  products: { type: Array, required: true },
})

const Cart = model('Carts', cartsSchema)
export { Cart }