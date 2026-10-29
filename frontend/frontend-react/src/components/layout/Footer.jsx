import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className='footer'>
      <div className='container'>
        <div className='footer-grid'>
          <div className='footer-column'>
            <h4>PintuNort</h4>
            <p>Tu pinturería de confianza en Jujuy.</p>
            <p>Cochinoca 885, San Salvador de Jujuy</p>
          </div>
          <div className='footer-column'>
            <h4>Navegación</h4>
            <Link to='/'>Inicio</Link>
            <Link to='/catalogo'>Catálogo</Link>
            <Link to='/carrito'>Carrito</Link>
          </div>
          <div className='footer-column'>
            <h4>Contacto</h4>
            <p>📍 Cochinoca 885, SSJ</p>
            <p>📞 (0388) 000-0000</p>
            <p>✉️ contacto@pintunort.com</p>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>© {new Date().getFullYear()} PintuNort — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
