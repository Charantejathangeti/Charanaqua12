import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, AuthState } from './types';
import { authService } from './services/api';

interface AppContextType {
  auth: AuthState;
  login: (user: User) => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Init Auth
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setAuth({ user, isAuthenticated: true });
    }
  }, []);

  const login = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const logout = () => {
    authService.logout();
    setAuth({ user: null, isAuthenticated: false });
  };

  // Cart Logic
  const addToCart = (product: Product, qty: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => 
          p.id === product.id ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.offerPrice || item.price;
    return sum + (price * item.quantity);
  }, 0);

  return (
    <AppContext.Provider value={{ 
      auth, login, logout, 
      cart, addToCart, removeFromCart, clearCart, cartTotal 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};