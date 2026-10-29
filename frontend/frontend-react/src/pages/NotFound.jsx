import { Link } from 'react-router-dom';
import '../styles/not-found.css';

function NotFound() {
  return (
    <section className='pagina-404'>
      <div className='numero-404'>404</div>
      <h1 className='titulo-404'>Página no encontrada</h1>
      <p className='descripcion-404'>La página que estás buscando no existe o fue movida.</p>
      <Link to='/' className='btn btn-primario'>
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFound;
