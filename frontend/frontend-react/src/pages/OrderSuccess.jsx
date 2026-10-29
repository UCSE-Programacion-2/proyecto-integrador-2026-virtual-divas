import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import OrderSummary from '../components/orders/OrderSummary';
import StatusMessage from '../components/ui/StatusMessage';
import { ordersApi } from '../services/api';
import { formatDate } from '../utils/format';
import { getOrderNumber, getPaymentLabel } from '../utils/orders';
import '../styles/checkout.css';
import '../styles/orders.css';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    ordersApi
      .getById(id)
      .then(data => {
        if (activo) setOrder(data);
      })
      .catch(err => {
        if (activo) setError(err.message);
      });
    return () => {
      activo = false;
    };
  }, [id]);

  if (error) {
    return (
      <main className='orders-page container'>
        <StatusMessage type='error'>{error}</StatusMessage>
      </main>
    );
  }

  if (!order) {
    return (
      <main className='orders-page container'>
        <StatusMessage type='loading'>Cargando tu pedido...</StatusMessage>
      </main>
    );
  }

  // Los ítems del pedido guardan el precio del momento de la compra
  const items = order.items.map(item => ({ ...item, id: item.product }));

  return (
    <main className='orders-page container'>
      <section className='card order-success'>
        <div className='order-success-icon' aria-hidden='true'>
          ✓
        </div>
        <h1>¡Gracias por tu compra, {order.cliente.nombre}!</h1>
        <p className='order-success-text'>
          Tu pedido <strong>{getOrderNumber(order)}</strong> quedó registrado el{' '}
          {formatDate(order.createdAt)}. Te vamos a contactar al {order.cliente.telefono} para
          coordinar la entrega.
        </p>
        <p className='order-success-text'>
          Método de pago: <strong>{getPaymentLabel(order.metodoPago)}</strong>
        </p>

        <div className='order-success-summary'>
          <OrderSummary
            items={items}
            subtotal={order.subtotal}
            shipping={order.envio}
            total={order.total}
          />
        </div>

        <div className='order-success-actions'>
          <Link to='/mis-compras' className='button button-secondary'>
            Ver mis compras
          </Link>
          <Link to='/catalogo' className='button button-primary'>
            Seguir comprando
          </Link>
        </div>
      </section>
    </main>
  );
}

export default OrderSuccess;
