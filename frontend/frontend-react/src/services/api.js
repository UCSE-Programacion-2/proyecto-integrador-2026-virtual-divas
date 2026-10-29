// Cliente HTTP único para toda la app.
// La URL sale de la variable de entorno VITE_API_URL (ver .env.example).
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/$/, '');

if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.warn('Falta configurar VITE_API_URL: se está usando localhost.');
}

export const TOKEN_KEY = 'authToken';
export const USER_KEY = 'authUser';
// Evento que avisa al AuthContext que la sesión venció
export const SESSION_EXPIRED_EVENT = 'auth:expired';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const request = async (path, { method = 'GET', body, params } = {}) => {
  const url = new URL(`${API_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });

  const headers = {};
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    throw new ApiError('No se pudo conectar con el servidor. Revisá tu conexión.', 0);
  }

  const data = await response.json().catch(() => null);

  if (response.status === 401 && token) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }

  if (!response.ok) {
    throw new ApiError(data?.mensaje || 'Ocurrió un error inesperado', response.status);
  }

  return data;
};

export const productsApi = {
  // filters: { q, categoria }
  list: filters => request('/products', { params: filters }),
  getById: id => request(`/products/${encodeURIComponent(id)}`),
  // Solo admin (el token se manda solo desde request)
  create: product => request('/products', { method: 'POST', body: product }),
  update: (id, product) => request(`/products/${id}`, { method: 'PUT', body: product }),
  remove: id => request(`/products/${id}`, { method: 'DELETE' }),
};

export const authApi = {
  login: credentials => request('/auth/login', { method: 'POST', body: credentials }),
  register: userData => request('/auth/register', { method: 'POST', body: userData }),
  me: () => request('/auth/me'),
};

export const cartApi = {
  get: () => request('/cart'),
  // items: [{ productId, quantity }]
  replace: items => request('/cart', { method: 'PUT', body: { items } }),
};

export const ordersApi = {
  // order: { items: [{ productId, quantity }], cliente, metodoPago }
  create: order => request('/orders', { method: 'POST', body: order }),
  mine: () => request('/orders/mine'),
  getById: id => request(`/orders/${encodeURIComponent(id)}`),
  // Solo admin
  listAll: () => request('/orders'),
  updateStatus: (id, estado) =>
    request(`/orders/${id}/status`, { method: 'PATCH', body: { estado } }),
};
