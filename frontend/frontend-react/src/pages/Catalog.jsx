import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import { productsApi } from '../services/api';
import { CATEGORIES } from '../utils/format';
import '../styles/catalog.css';

function Catalog() {
  // Los filtros viven en la URL (?q=...&categoria=...) para poder compartir el link
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const categoria = searchParams.get('categoria') || '';

  const [searchInput, setSearchInput] = useState(q);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  // Si el texto cambia desde afuera (ej: búsqueda del Home), actualiza el input
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Espera a que el usuario deje de escribir antes de buscar
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput.trim() !== q) updateFilter('q', searchInput.trim());
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // Cada vez que cambian los filtros, vuelve a pedir a la API
  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError('');

    productsApi
      .list({ q, categoria })
      .then(data => {
        if (activo) setProducts(data);
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [q, categoria]);

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  return (
    <>
      <header className='catalog-hero'>
        <div className='container'>
          <h1>
            Catálogo de <span>productos</span>
          </h1>
          <p>Explorá pinturas, esmaltes y accesorios para tu próximo proyecto.</p>
        </div>
      </header>

      <main className='catalog-page'>
        <div className='container catalog-layout'>
          <aside className='card filters-panel'>
            <h2>Filtros</h2>
            <p className='filters-text'>Buscá por nombre o marca y filtrá por categoría.</p>

            <div className='filter-group'>
              <h3>Buscar</h3>
              <input
                type='search'
                placeholder='Ej: látex, Alba'
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
                aria-label='Buscar productos'
              />
            </div>

            <div className='filter-group'>
              <h3>Categoría</h3>
              <label htmlFor='categoria-todas'>
                <input
                  id='categoria-todas'
                  type='radio'
                  name='categoria'
                  checked={!categoria}
                  onChange={() => updateFilter('categoria', '')}
                />
                Todas
              </label>
              {CATEGORIES.map(category => (
                <label key={category.value} htmlFor={`categoria-${category.value}`}>
                  <input
                    id={`categoria-${category.value}`}
                    type='radio'
                    name='categoria'
                    checked={categoria === category.value}
                    onChange={() => updateFilter('categoria', category.value)}
                  />
                  {category.label}
                </label>
              ))}
            </div>

            <button
              type='button'
              className='button button-secondary filters-button'
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>
          </aside>

          <section className='catalog-products'>
            <div className='catalog-header'>
              <div>
                <h2>Productos disponibles</h2>
                <p>{q ? `Resultados para "${q}"` : 'Datos actualizados desde la API.'}</p>
              </div>
              <span className='catalog-count'>
                {loading ? '...' : `${products.length} productos`}
              </span>
            </div>
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              emptyText='No encontramos productos con esos filtros.'
            />
          </section>
        </div>
      </main>
    </>
  );
}

export default Catalog;
