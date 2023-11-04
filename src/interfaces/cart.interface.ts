export interface Cart {
  id: string;
  products: ProductDetail[];
}

export interface ProductIncart {
  id: string;
  quantity: number;
}

export interface ProductDetail extends ProductIncart {
  quantity: number;
}
