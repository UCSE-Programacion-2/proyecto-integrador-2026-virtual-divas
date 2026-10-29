import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusMessage from '../components/ui/StatusMessage';
import { ordersApi } from '../services/api';
import { formatDate, formatPrice } from '../utils/format';
import { getOrderNumber, getPaymentLabel, ORDER_STATUS } from '../utils/orders';
import '../styles/orders.css';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    ordersApi
      .mine()
      .then(data => {
        if (activo) setOrders(data);
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
  }, []);

  let content;
  if (loading) content = <StatusMessage type='loading'>Cargando tus compras...</StatusMessage>;
  else if (error) content = <StatusMessage type='error'>{error}</StatusMessage>;
  else if (!orders.length) {
    content = (
      <StatusMessage>
        Todavía no hiciste compras. <Link to='/catalogo'>Ir al catálogo</Link>
      </StatusMessage>
    );
  } else {
    content = (
      <div className='orders-list'>
        {orders.map(order => (
          <article className='card order-card' key={order._id}>
            <div className='order-card-header'>
              <div>
                <h2>Pedido {getOrderNumber(order)}</h2>
                <p>
                  {formatDate(order.createdAt)} · {getPaymentLabel(order.metodoPago)}
                </p>
              </div>
              <span className={`order-status status-${order.estado}`}>
                {ORDER_STATUS[order.estado]}
              </span>
            </div>
            <ul className='order-card-items'>
              {order.items.map(item => (
                <li key={item.product}>
                  {item.quantity} × {item.nombre}
                  <span>{formatPrice(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <p className='order-card-total'>
              Total <strong>{formatPrice(order.total)}</strong>
            </p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <>
      <header className='orders-hero'>
        <div className='container'>
          <h1>
            Mis <span>compras</span>
          </h1>
          <p>Historial de pedidos guardado en tu cuenta.</p>
        </div>
      </header>
      <main className='orders-page container'>{content}</main>
    </>
  );
}

export default MyOrders;
