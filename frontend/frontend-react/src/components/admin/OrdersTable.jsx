import PropTypes from 'prop-types';
import { formatDate, formatPrice } from '../../utils/format';
import { getOrderNumber, getPaymentLabel, ORDER_STATUS } from '../../utils/orders';

function OrdersTable({ orders, onChangeStatus }) {
  if (!orders.length) {
    return <p className='admin-empty'>Todavía no hay pedidos.</p>;
  }

  return (
    <div className='table-wrapper'>
      <table className='products-table'>
        <thead>
          <tr>
            <th>Pedido</th>
            <th>Cliente</th>
            <th>Productos</th>
            <th>Total</th>
            <th>Pago</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td data-label='Pedido'>
                <p className='product-name'>{getOrderNumber(order)}</p>
                <p className='product-brand'>{formatDate(order.createdAt)}</p>
              </td>
              <td data-label='Cliente'>
                <p className='product-name'>
                  {order.cliente.nombre} {order.cliente.apellido}
                </p>
                <p className='product-brand'>{order.cliente.telefono}</p>
              </td>
              <td data-label='Productos'>
                {order.items.map(item => (
                  <p key={item.product} className='order-line'>
                    {item.quantity} × {item.nombre}
                  </p>
                ))}
              </td>
              <td data-label='Total'>{formatPrice(order.total)}</td>
              <td data-label='Pago'>{getPaymentLabel(order.metodoPago)}</td>
              <td data-label='Estado'>
                <select
                  className={`order-status-select status-${order.estado}`}
                  value={order.estado}
                  onChange={event => onChangeStatus(order, event.target.value)}
                  aria-label={`Estado del pedido ${getOrderNumber(order)}`}
                >
                  {Object.entries(ORDER_STATUS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

OrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      createdAt: PropTypes.string,
      estado: PropTypes.string.isRequired,
      total: PropTypes.number.isRequired,
      metodoPago: PropTypes.string,
      cliente: PropTypes.shape({
        nombre: PropTypes.string,
        apellido: PropTypes.string,
        telefono: PropTypes.string,
      }).isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          product: PropTypes.string,
          nombre: PropTypes.string,
          quantity: PropTypes.number,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};

export default OrdersTable;
