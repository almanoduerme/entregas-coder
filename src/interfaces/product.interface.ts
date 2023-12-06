interface ProductBase {
  title: string;
  description: string;
  code: string;
  price: number;
  status: boolean;
  stock: number;
  category: string;
  thumbnails: string[];
}

interface Product extends ProductBase {
  id: string;
}

export { ProductBase, Product };