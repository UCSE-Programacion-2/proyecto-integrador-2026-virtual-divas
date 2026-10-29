import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useCart } from '../../context/CartContext';
import { productShape } from '../../utils/shapes';

// Botón que agrega al carrito global desde cualquier pantalla (sin prop drilling)
function AddToCartButton({ product, quantity = 1, className = 'button button-primary' }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const sinStock = !product.stock;

  useEffect(() => {
    if (!added) return undefined;
    const timeout = setTimeout(() => setAdded(false), 1500);
    return () => clearTimeout(timeout);
  }, [added]);

  const handleClick = () => {
    addItem(product, quantity);
    setAdded(true);
  };

  let label = 'Agregar al carrito';
  if (sinStock) label = 'Sin stock';
  else if (added) label = '✓ Agregado';

  return (
    <button type='button' className={className} onClick={handleClick} disabled={sinStock}>
      {label}
    </button>
  );
}

AddToCartButton.propTypes = {
  product: productShape.isRequired,
  quantity: PropTypes.number,
  className: PropTypes.string,
};

export default AddToCartButton;
