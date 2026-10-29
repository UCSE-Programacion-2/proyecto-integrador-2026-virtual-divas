import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice, getCategoryLabel } from '../../utils/format';
import { cartItemShape } from '../../utils/shapes';
import QuantityControl from './QuantityControl';

function CartItemRow({ item }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <tr>
      <td data-label='Producto'>
        <div className='cart-product-cell'>
          <img src={item.imagen} alt={item.nombre} />
          <div>
            <Link to={`/producto/${item.id}`} className='cart-product-name'>
              {item.nombre}
            </Link>
            <p className='cart-product-brand'>
              {item.marca} · {getCategoryLabel(item.categoria)}
            </p>
          </div>
        </div>
      </td>
      <td data-label='Precio'>{formatPrice(item.precio)}</td>
      <td data-label='Cantidad'>
        <QuantityControl
          value={item.quantity}
          min={0}
          max={item.stock}
          onChange={quantity => updateQuantity(item.id, quantity)}
        />
      </td>
      <td data-label='Subtotal'>
        <strong>{formatPrice(item.precio * item.quantity)}</strong>
      </td>
      <td data-label='Acción'>
        <button type='button' className='remove-button' onClick={() => removeItem(item.id)}>
          Quitar
        </button>
      </td>
    </tr>
  );
}

CartItemRow.propTypes = {
  item: cartItemShape.isRequired,
};

export default CartItemRow;
