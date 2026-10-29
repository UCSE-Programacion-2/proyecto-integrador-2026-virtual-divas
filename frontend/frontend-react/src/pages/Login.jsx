import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  // Formulario controlado: el estado de React es la fuente de verdad
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);

  if (isLoggedIn && !sending) return <Navigate to={from} replace />;

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSending(true);
    setMessage({ type: 'success', text: 'Validando credenciales...' });

    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      setMessage({ type: 'success', text: `¡Hola, ${user.name}! Redirigiendo...` });
      navigate(user.role === 'admin' && from === '/' ? '/admin' : from, { replace: true });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setSending(false);
    }
  };

  return (
    <>
      <header className='auth-hero'>
        <div className='container'>
          <h1>
            Iniciar <span>sesión</span>
          </h1>
          <p>Accedé a tu cuenta para gestionar tu carrito y tus compras.</p>
        </div>
      </header>

      <main className='auth-page'>
        <div className='container'>
          <section className='card auth-card' aria-labelledby='login-title'>
            <h2 id='login-title'>Ingresá tus datos</h2>
            <p className='auth-description'>
              Usá el email y la contraseña registrados en PintuNort.
            </p>

            <form className='auth-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='email-input'>Email</label>
                <input
                  type='email'
                  id='email-input'
                  name='email'
                  placeholder='usuario@mail.com'
                  autoComplete='email'
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='password-input'>Contraseña</label>
                <input
                  type='password'
                  id='password-input'
                  name='password'
                  placeholder='Tu contraseña'
                  autoComplete='current-password'
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {message && (
                <p className={`auth-message visible ${message.type}`} role='alert'>
                  {message.text}
                </p>
              )}

              <div className='auth-actions'>
                <button type='submit' className='button button-primary' disabled={sending}>
                  {sending ? 'Ingresando...' : 'Iniciar sesión'}
                </button>
                <Link to='/registro' state={{ from }} className='auth-link'>
                  ¿No tenés cuenta? Registrate
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default Login;
