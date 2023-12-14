import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ProductDocument, ProductModel } from './product-model.interface';

const productSchema = new Schema<ProductDocument>({
  title: { type: String, required: true, max: 26 },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 14 },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: [String], required: true },
});

productSchema.plugin(mongoosePaginate);

const Product: ProductModel = model<ProductDocument, ProductModel>('Product', productSchema);

export { Product };