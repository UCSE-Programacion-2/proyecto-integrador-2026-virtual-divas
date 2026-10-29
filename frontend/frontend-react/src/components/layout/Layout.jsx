import PropTypes from 'prop-types';
import Navbar from './Navbar';
import Footer from './Footer';

// Estructura común a todas las pantallas: navbar arriba, footer abajo
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className='page-content'>{children}</div>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
