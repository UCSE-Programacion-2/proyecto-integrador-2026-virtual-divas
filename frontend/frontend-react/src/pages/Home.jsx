import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { productsApi } from '../services/api';
import { CATEGORIES } from '../utils/format';
import '../styles/home.css';

const DESTACADOS = 8;

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Trae los productos una sola vez al montar la pantalla
  useEffect(() => {
    let activo = true;

    productsApi
      .list()
      .then(data => {
        if (activo) setProducts(data.slice(0, DESTACADOS));
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    // Evita actualizar el estado si el usuario ya se fue de la pantalla
    return () => {
      activo = false;
    };
  }, []);

  const handleSearch = event => {
    event.preventDefault();
    const q = search.trim();
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo');
  };

  return (
    <>
      <section className='banner'>
        <div className='container'>
          <div className='banner-texto'>
            <h1>
              Tu pinturería <span>de confianza</span> en Jujuy
            </h1>
            <p>
              Encontrá pinturas, esmaltes y accesorios para tu hogar o proyecto. Calidad
              garantizada.
            </p>
            <form className='banner-search' onSubmit={handleSearch} role='search'>
              <input
                type='search'
                placeholder='¿Qué estás buscando? Ej: látex, esmalte...'
                value={search}
                onChange={event => setSearch(event.target.value)}
                aria-label='Buscar productos'
              />
              <button type='submit' className='btn btn-primario'>
                Buscar
              </button>
            </form>
          </div>
          <div className='banner-imagen'>
            <img src='/assets/Pintunort.png' alt='Local de PintuNort' />
          </div>
        </div>
      </section>

      <section className='categorias'>
        <div className='container'>
          <h2 className='seccion-titulo'>Categorías</h2>
          <div className='categorias-grid'>
            {CATEGORIES.map(category => (
              <Link
                key={category.value}
                to={`/catalogo?categoria=${category.value}`}
                className='categoria-card'
              >
                <div className='categoria-icono'>{category.icon}</div>
                <h3>{category.label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='destacados'>
        <div className='container'>
          <h2 className='seccion-titulo'>Productos Destacados</h2>
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            emptyText='No hay productos disponibles por el momento.'
          />
          <div className='destacados-mas'>
            <Link to='/catalogo' className='btn btn-secundario'>
              Ver todo el catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
