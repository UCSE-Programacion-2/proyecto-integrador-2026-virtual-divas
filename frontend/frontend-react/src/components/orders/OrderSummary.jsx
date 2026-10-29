import PropTypes from 'prop-types';
import { formatPrice } from '../../utils/format';

// Lista de productos + totales. Se usa en el checkout y en la confirmación.
function OrderSummary({ items, subtotal, shipping, total }) {
  return (
    <>
      <div className='summary-products'>
        {items.map(item => (
          <article
            className={`summary-product ${item.imagen ? '' : 'summary-product-no-image'}`}
            key={item.id}
          >
            {item.imagen && <img src={item.imagen} alt={item.nombre} />}
            <div className='summary-product-info'>
              <h3>{item.nombre}</h3>
              <p>
                {item.marca} · Cantidad: {item.quantity}
              </p>
            </div>
            <strong>{formatPrice(item.precio * item.quantity)}</strong>
          </article>
        ))}
      </div>
      <div className='summary-totals'>
        <div className='summary-row'>
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className='summary-row'>
          <span>Envío</span>
          <strong>{formatPrice(shipping)}</strong>
        </div>
        <div className='summary-row summary-total'>
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    </>
  );
}

OrderSummary.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      nombre: PropTypes.string.isRequired,
      marca: PropTypes.string,
      imagen: PropTypes.string,
      precio: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    }),
  ).isRequired,
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
};

export default OrderSummary;
