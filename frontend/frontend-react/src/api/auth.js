const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}/api/auth${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'No se pudo completar la operación');
  return data;
};

export const register = (userData) => request('/register', { method: 'POST', body: JSON.stringify(userData) });
export const login = (credentials) => request('/login', { method: 'POST', body: JSON.stringify(credentials) });
export const getCurrentUser = (token) => request('/me', { headers: { Authorization: `Bearer ${token}` } });
