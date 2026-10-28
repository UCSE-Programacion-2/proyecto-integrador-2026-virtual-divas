const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const request = async (path, token, options = {}) => {
  const response = await fetch(`${API_URL}/api/cart${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.mensaje || data.message || 'No se pudo actualizar el carrito');
  return data;
};

export const getCart = (token) => request('/', token);
export const addCartItem = (token, productId, quantity) => request('/items', token, {
  method: 'POST',
  body: JSON.stringify({ productId, quantity }),
});
export const updateCartItem = (token, productId, quantity) => request(`/items/${productId}`, token, {
  method: 'PATCH',
  body: JSON.stringify({ quantity }),
});
export const removeCartItem = (token, productId) => request(`/items/${productId}`, token, { method: 'DELETE' });
export const clearCart = (token) => request('/', token, { method: 'DELETE' });
