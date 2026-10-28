import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  let submitLabel = isRegister ? 'Registrarme' : 'Ingresar';
  if (submitting) submitLabel = 'Procesando...';
  const handleChange = ({ target }) => setForm({ ...form, [target.name]: target.value });
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) await register(form);
      else await login({ email: form.email, password: form.password });
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>{isRegister ? 'Crear cuenta' : 'Iniciar sesión'}</h1>
        {isRegister && <label htmlFor="name">Nombre<input id="name" name="name" value={form.name} onChange={handleChange} required /></label>}
        <label htmlFor="email">Email<input id="email" type="email" name="email" value={form.email} onChange={handleChange} required /></label>
        <label htmlFor="password">Contraseña<input id="password" type="password" name="password" minLength="6" value={form.password} onChange={handleChange} required /></label>
        {error && <p className="form-error">{error}</p>}
        <button className="button-primary" type="submit" disabled={submitting}>{submitLabel}</button>
        <p>{isRegister ? '¿Ya tenés una cuenta? ' : '¿No tenés una cuenta? '}<Link to={isRegister ? '/login' : '/register'}>{isRegister ? 'Iniciá sesión' : 'Registrate'}</Link></p>
      </form>
    </main>
  );
}
