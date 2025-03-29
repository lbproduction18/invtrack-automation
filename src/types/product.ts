export interface Product {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  SKU: string;
  category: string | null;
  price: number | null;
  stock_quantity: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface SelectedSKU {
  productId: string;
  SKU: string;
  productName: string | null;
  quantity: number;
  price: number;
}
