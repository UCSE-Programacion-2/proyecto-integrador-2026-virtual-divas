import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatusMessage from '../ui/StatusMessage';

// Envuelve una pantalla que necesita sesión (y opcionalmente rol admin)
function ProtectedRoute({ children, adminOnly = false }) {
  const { isLoggedIn, isAdmin, checking } = useAuth();
  const location = useLocation();

  if (checking) {
    return (
      <div className='container protected-loading'>
        <StatusMessage type='loading'>Verificando sesión...</StatusMessage>
      </div>
    );
  }

  if (!isLoggedIn) {
    // Guarda a dónde quería ir para volver después del login
    return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to='/' replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;
