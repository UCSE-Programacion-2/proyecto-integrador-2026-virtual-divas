import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './AuthContext';
import { cartApi } from '../services/api';
import { getProductImage } from '../utils/format';

const CART_KEY = 'pintunortCart';
export const SHIPPING_COST = 1500;

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
};

// Pasa un ítem del backend al formato del carrito del front
const fromServer = item => ({
  id: item.productId,
  nombre: item.nombre,
  marca: item.marca,
  categoria: item.categoria,
  precio: item.precio,
  imagen: getProductImage(item),
  stock: item.stock,
  quantity: item.quantity,
});

// Junta el carrito local (de antes del login) con el guardado en la base
const mergeCarts = (local, server) => {
  const merged = server.map(fromServer);
  local.forEach(item => {
    const existing = merged.find(m => m.id === item.id);
    if (existing) existing.quantity = Math.max(existing.quantity, item.quantity);
    else merged.push(item);
  });
  return merged;
};

const limitToStock = (quantity, stock) =>
  typeof stock === 'number' ? Math.min(quantity, stock) : quantity;

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(readStoredCart);
  // Usuario cuyo carrito ya se trajo de la base (para no pisarlo antes de tiempo)
  const [syncedUserId, setSyncedUserId] = useState(null);
  const previousUserId = useRef(user?.id ?? null);

  // 1) Siempre persiste en localStorage (sirve aunque no haya sesión)
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // 2) Al iniciar sesión trae el carrito de la base; al cerrar sesión lo vacía
  useEffect(() => {
    const userId = user?.id ?? null;

    if (!userId) {
      if (previousUserId.current) setItems([]);
      previousUserId.current = null;
      setSyncedUserId(null);
      return undefined;
    }

    previousUserId.current = userId;
    let activo = true;

    cartApi
      .get()
      .then(serverCart => {
        if (!activo) return;
        setItems(local => mergeCarts(local, serverCart.items));
        setSyncedUserId(userId);
      })
      .catch(error => console.error('No se pudo traer el carrito guardado:', error));

    return () => {
      activo = false;
    };
  }, [user?.id]);

  // 3) Con sesión, cada cambio se guarda también en la base (con una pequeña espera)
  useEffect(() => {
    if (!user?.id || syncedUserId !== user.id) return undefined;

    const timeout = setTimeout(() => {
      cartApi
        .replace(items.map(item => ({ productId: item.id, quantity: item.quantity })))
        .catch(error => console.error('No se pudo guardar el carrito:', error));
    }, 400);

    return () => clearTimeout(timeout);
  }, [items, user?.id, syncedUserId]);

  const addItem = (product, quantity = 1) => {
    const id = product._id || product.id;

    setItems(current => {
      const existing = current.find(item => item.id === id);

      if (existing) {
        return current.map(item =>
          item.id === id
            ? { ...item, quantity: limitToStock(item.quantity + quantity, product.stock) }
            : item,
        );
      }

      return [
        ...current,
        {
          id,
          nombre: product.nombre,
          marca: product.marca,
          categoria: product.categoria,
          precio: product.precio,
          imagen: getProductImage(product),
          stock: product.stock,
          quantity: limitToStock(quantity, product.stock),
        },
      ];
    });
  };

  const removeItem = id => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.id === id ? { ...item, quantity: limitToStock(quantity, item.stock) } : item,
      ),
    );
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.precio * item.quantity, 0);
    const shipping = items.length ? SHIPPING_COST : 0;

    return {
      items,
      count,
      subtotal,
      shipping,
      total: subtotal + shipping,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart se usa dentro de <CartProvider>');
  return context;
};
