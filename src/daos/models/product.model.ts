import { model, Schema } from 'mongoose'
import { ProductBase } from '../../interfaces/product.interface'

const productSchema = new Schema<ProductBase>({
  title: { type: String, required: true, max: 26 },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 14 },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], required: true },
})

const Product = model('Product', productSchema)
export { Product }