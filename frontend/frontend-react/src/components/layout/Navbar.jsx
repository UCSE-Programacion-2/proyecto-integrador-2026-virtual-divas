import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// NavLink agrega la clase "active" al link de la ruta actual
const linkClass = ({ isActive }) => (isActive ? 'active' : undefined);

function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='navbar'>
      <div className='container'>
        <Link to='/' className='navbar-brand'>
          Pintu<span>Nort</span>
        </Link>
        <ul className='navbar-menu'>
          <li>
            <NavLink to='/' end className={linkClass}>
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink to='/catalogo' className={linkClass}>
              Catálogo
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to='/admin' className={linkClass}>
                Admin
              </NavLink>
            </li>
          )}
          {isLoggedIn ? (
            <>
              <li>
                <NavLink to='/mis-compras' className={linkClass}>
                  Mis compras
                </NavLink>
              </li>
              <li className='navbar-user'>Hola, {user.name.split(' ')[0]}</li>
              <li>
                <button type='button' className='navbar-logout' onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/login' className={linkClass}>
                  Iniciar sesión
                </NavLink>
              </li>
              <li>
                <NavLink to='/registro' className={linkClass}>
                  Registrarse
                </NavLink>
              </li>
            </>
          )}
          <li>
            <Link to='/carrito' className='navbar-cart'>
              🛒 Carrito
              {count > 0 && <span className='navbar-cart-count'>{count}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
