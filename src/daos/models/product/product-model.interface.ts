import { Model } from "mongoose";
import { ProductBase } from "../../../interfaces";

interface Query {
  title?: string;
  code?: string;
  price?: number;
  stock?: number;
  status?: string;
  category?: string;
}

interface Options {
  limit?: number;
  page?: number;
  sort?: { price: number }
  query?: Query;
}

interface PaginateResult {
  docs: ProductDocument[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
}

interface ProductDocument extends Document, ProductBase {}

interface ProductModel extends Model<ProductDocument> {
  paginate(
    query?: Query,
    options?: Options,
    callback?: (err: string, result: PaginateResult) => void
  ): Promise<PaginateResult>;
}

export { ProductDocument, ProductModel, PaginateResult, Query, Options }