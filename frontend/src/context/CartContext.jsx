import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'campusbite_cart';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { _id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((i) => i._id !== id)
        : prev.map((i) => (i._id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const count = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);
  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, count, total }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, count, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
