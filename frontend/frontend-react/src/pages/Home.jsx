import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <main className="home-page">
      <section className="home-card">
        <h1>Pintu<span>Nort</span></h1>
        {user ? <><p>Hola, <strong>{user.name}</strong>. Tu sesión está activa.</p><button className="button-danger" type="button" onClick={logout}>Cerrar sesión</button>
        </> : <p><Link to="/login">Iniciá sesión</Link> para continuar.</p>}
      </section>
    </main>
  );
}
