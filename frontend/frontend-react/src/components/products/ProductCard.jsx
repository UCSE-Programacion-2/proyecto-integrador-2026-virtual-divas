import { Link } from 'react-router-dom';
import AddToCartButton from '../cart/AddToCartButton';
import { formatPrice, getProductImage } from '../../utils/format';
import { productShape } from '../../utils/shapes';

function ProductCard({ product }) {
  const detailUrl = `/producto/${product._id}`;

  return (
    <article className='card catalog-card'>
      <Link to={detailUrl} className='catalog-image'>
        <img src={getProductImage(product)} alt={product.nombre} loading='lazy' />
      </Link>
      <div className='catalog-info'>
        <p className='catalog-brand'>{product.marca}</p>
        <h3>{product.nombre}</h3>
        {product.descripcion && <p className='catalog-description'>{product.descripcion}</p>}
        <p className='catalog-price'>{formatPrice(product.precio)}</p>
        <div className='product-card-actions'>
          <Link to={detailUrl} className='button button-secondary'>
            Ver detalle
          </Link>
          <AddToCartButton product={product} />
        </div>
      </div>
    </article>
  );
}

ProductCard.propTypes = {
  product: productShape.isRequired,
};

export default ProductCard;
