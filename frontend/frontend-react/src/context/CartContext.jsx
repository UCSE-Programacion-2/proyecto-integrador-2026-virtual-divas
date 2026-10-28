import { createContext, useContext, useEffect, useState } from 'react';
import * as cartApi from '../api/cart';
import { useAuth } from './AuthContext';

const CART_KEY = 'cartItems';
const CartContext = createContext(null);

const emptyCart = { items: [], total: 0 };

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : emptyCart;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
  };

  useEffect(() => {
    if (!token) {
      saveCart(emptyCart);
      return undefined;
    }

    setLoading(true);
    cartApi.getCart(token)
      .then(saveCart)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
    return undefined;
  }, [token]);

  const addItem = async (product, quantity = 1) => {
    const productId = product.id || product.productId;
    const current = cart.items.find((item) => String(item.productId) === String(productId));
    const newQuantity = (current?.quantity || 0) + quantity;

    if (product.stock !== undefined && newQuantity > product.stock) {
      throw new Error('No hay stock suficiente');
    }

    setError('');
    if (!token) return undefined;
    saveCart(await cartApi.addCartItem(token, productId, quantity));
    return undefined;
  };

  const removeItem = async (productId) => {
    setError('');
    if (!token) {
      saveCart({ ...cart, items: cart.items.filter((item) => item.productId !== productId) });
      return undefined;
    }
    saveCart(await cartApi.removeCartItem(token, productId));
    return undefined;
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return removeItem(productId);
    setError('');
    if (!token) return undefined;
    saveCart(await cartApi.updateCartItem(token, productId, quantity));
    return undefined;
  };

  const clear = async () => {
    setError('');
    if (!token) {
      saveCart(emptyCart);
      return undefined;
    }
    saveCart(await cartApi.clearCart(token));
    return undefined;
  };

  // El contexto mantiene pocas funciones y se actualiza junto con el carrito.
  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const value = {
    ...cart, loading, error, addItem, removeItem, updateQuantity, clear,
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
