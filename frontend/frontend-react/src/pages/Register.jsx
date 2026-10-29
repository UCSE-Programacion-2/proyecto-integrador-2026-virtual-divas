import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const initialForm = { name: '', email: '', password: '', confirm: '' };

function Register() {
  const { register, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from || '/';

  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState(null);
  const [sending, setSending] = useState(false);

  if (isLoggedIn && !sending) return <Navigate to={from} replace />;

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (form.password !== form.confirm) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setSending(true);
    setMessage({ type: 'success', text: 'Creando tu cuenta...' });

    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      setMessage({ type: 'success', text: 'Usuario creado con éxito. ¡Bienvenido!' });
      setTimeout(() => navigate(from, { replace: true }), 900);
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
            Crear <span>cuenta</span>
          </h1>
          <p>Registrate para acceder a tu cuenta y preparar tus compras en PintuNort.</p>
        </div>
      </header>

      <main className='auth-page'>
        <div className='container'>
          <section className='card auth-card' aria-labelledby='register-title'>
            <h2 id='register-title'>Completá tus datos</h2>
            <p className='auth-description'>
              Usá un email válido y una contraseña de al menos 6 caracteres.
            </p>

            <form className='auth-form' onSubmit={handleSubmit}>
              <div className='form-group'>
                <label htmlFor='name-input'>Nombre</label>
                <input
                  type='text'
                  id='name-input'
                  name='name'
                  placeholder='Juan Pérez'
                  autoComplete='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
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
                  placeholder='Mínimo 6 caracteres'
                  autoComplete='new-password'
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className='form-group'>
                <label htmlFor='confirm-input'>Repetir contraseña</label>
                <input
                  type='password'
                  id='confirm-input'
                  name='confirm'
                  placeholder='Repetí la contraseña'
                  autoComplete='new-password'
                  minLength={6}
                  value={form.confirm}
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
                  {sending ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
                <Link to='/login' state={{ from }} className='auth-link'>
                  Ya tengo cuenta
                </Link>
              </div>
            </form>
          </section>
        </div>
      </main>
    </>
  );
}

export default Register;
