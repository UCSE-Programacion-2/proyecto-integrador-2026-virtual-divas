import PropTypes from 'prop-types';
import ProductCard from './ProductCard';
import { productShape } from '../../utils/shapes';
import StatusMessage from '../ui/StatusMessage';
import '../../styles/products.css';

// Recibe el estado del fetch del padre y decide qué mostrar
function ProductGrid({
  products,
  loading = false,
  error = '',
  emptyText = 'No hay productos para mostrar.',
}) {
  if (loading) return <StatusMessage type='loading'>Cargando productos...</StatusMessage>;
  if (error) return <StatusMessage type='error'>{error}</StatusMessage>;
  if (!products.length) return <StatusMessage>{emptyText}</StatusMessage>;

  return (
    <div className='products-grid'>
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

ProductGrid.propTypes = {
  products: PropTypes.arrayOf(productShape).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  emptyText: PropTypes.string,
};

export default ProductGrid;
