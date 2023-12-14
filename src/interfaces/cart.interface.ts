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

export interface CartReturn {
  _id: string;
  products: {
    product: string;
    quantity: number;
    _id: string;
  }[];
}
