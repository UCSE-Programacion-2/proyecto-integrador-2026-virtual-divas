import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { authApi, SESSION_EXPIRED_EVENT, TOKEN_KEY, USER_KEY } from '../services/api';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  // La sesión se guarda en localStorage: sobrevive a cerrar el navegador
  const [user, setUser] = useState(() =>
    localStorage.getItem(TOKEN_KEY) ? readStoredUser() : null,
  );
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)));

  const saveSession = ({ token, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  // Al abrir la app valida que el token guardado siga sirviendo
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;

    authApi
      .me()
      .then(data => {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        setUser(data.user);
      })
      .catch(error => {
        if (error.status === 401) logout();
      })
      .finally(() => setChecking(false));
  }, [logout]);

  // Si cualquier pedido a la API devuelve 401, se cierra la sesión
  useEffect(() => {
    window.addEventListener(SESSION_EXPIRED_EVENT, logout);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, logout);
  }, [logout]);

  const login = async credentials => {
    const data = await authApi.login(credentials);
    saveSession(data);
    return data.user;
  };

  // El backend devuelve token al registrarse: queda logueado directamente
  const register = async userData => {
    const data = await authApi.register(userData);
    saveSession(data);
    return data.user;
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      isAdmin: user?.role === 'admin',
      checking,
      login,
      register,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, checking, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth se usa dentro de <AuthProvider>');
  return context;
};
