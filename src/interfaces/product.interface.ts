export interface ProductBase {
  title: string;
  description: string;
  code: string;
  price: number;
  status: boolean;
  stock: number;
  category: string;
  thumbnail: string[];
}

export interface Product extends ProductBase {
  id: string;
}

export type ProductPreview = Omit<ProductBase, "id">;