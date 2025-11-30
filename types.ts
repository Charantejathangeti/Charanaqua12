export type Category = 'Freshwater' | 'Marine' | 'Exotic' | 'Tanks' | 'Food' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  scientificName?: string;
  category: Category;
  price: number;
  offerPrice?: number;
  stock: number;
  origin: string;
  description: string;
  image: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'customer';
  address: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'delivered';
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}