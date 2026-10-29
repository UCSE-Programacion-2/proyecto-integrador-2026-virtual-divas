import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AddToCartButton from '../components/cart/AddToCartButton';
import QuantityControl from '../components/cart/QuantityControl';
import StatusMessage from '../components/ui/StatusMessage';
import { productsApi } from '../services/api';
import { formatPrice, getCategoryLabel, getProductImage } from '../utils/format';
import '../styles/detail.css';

function ProductDetail() {
  // El id llega por la URL: /producto/:id
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError('');
    setQuantity(1);

    productsApi
      .getById(id)
      .then(data => {
        if (activo) setProduct(data);
      })
      .catch(err => {
        if (activo) setError(err.status === 404 ? 'Este producto no existe.' : err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) document.title = `PintuNort - ${product.nombre}`;
    return () => {
      document.title = 'PintuNort - Tu pinturería en Jujuy';
    };
  }, [product]);

  if (loading || error) {
    return (
      <main className='detail-page'>
        <div className='container'>
          {loading ? (
            <StatusMessage type='loading'>Cargando producto...</StatusMessage>
          ) : (
            <StatusMessage type='error'>{error}</StatusMessage>
          )}
          <p className='detail-back'>
            <Link to='/catalogo' className='button button-secondary'>
              Volver al catálogo
            </Link>
          </p>
        </div>
      </main>
    );
  }

  const image = getProductImage(product);
  const sinStock = !product.stock;

  return (
    <>
      <header className='detail-hero'>
        <div className='container'>
          <p className='detail-kicker'>Detalle del producto</p>
          <h1>
            {product.nombre} <span className='detail-hero-highlight'>{product.marca}</span>
          </h1>
          <p className='detail-hero-description'>
            Conocé sus características principales y agregalo al carrito para preparar tu pedido.
          </p>
        </div>
      </header>

      <main className='detail-page'>
        <div className='container detail-layout'>
          <section className='card product-detail-card' aria-labelledby='product-detail-title'>
            <div className='product-gallery'>
              <div className='product-main-image'>
                <img src={image} alt={product.nombre} />
              </div>
            </div>

            <div className='product-detail-info'>
              <span className='product-category'>{getCategoryLabel(product.categoria)}</span>
              <h2 id='product-detail-title'>{product.nombre}</h2>
              <p className='product-brand-detail'>{product.marca}</p>
              <p className='product-description'>
                {product.descripcion || 'Producto disponible en PintuNort.'}
              </p>

              <div className='product-price-box'>
                <span className='product-price-label'>Precio final</span>
                <strong>{formatPrice(product.precio)}</strong>
              </div>

              <div className='product-actions'>
                {!sinStock && (
                  <QuantityControl value={quantity} max={product.stock} onChange={setQuantity} />
                )}
                <AddToCartButton product={product} quantity={quantity} />
                <Link to='/catalogo' className='button button-secondary'>
                  Volver al catálogo
                </Link>
              </div>
            </div>
          </section>

          <aside className='card product-summary' aria-labelledby='product-summary-title'>
            <h2 id='product-summary-title'>Información rápida</h2>
            <div className='summary-list'>
              <div className='summary-item'>
                <span className='summary-label'>Disponibilidad</span>
                <strong>{sinStock ? 'Sin stock' : `${product.stock} unidades`}</strong>
              </div>
              <div className='summary-item'>
                <span className='summary-label'>Categoría</span>
                <strong>{getCategoryLabel(product.categoria)}</strong>
              </div>
              <div className='summary-item'>
                <span className='summary-label'>Marca</span>
                <strong>{product.marca}</strong>
              </div>
            </div>
            <div className='delivery-card'>
              <h3>Retiro o entrega</h3>
              <p className='delivery-card-description'>
                Podés retirar por Cochinoca 885 o coordinar envío dentro de San Salvador de Jujuy.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default ProductDetail;
