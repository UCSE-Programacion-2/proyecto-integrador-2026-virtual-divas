import { Link } from 'react-router-dom';
import CartItemRow from '../components/cart/CartItemRow';
import StatusMessage from '../components/ui/StatusMessage';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import '../styles/cart.css';

function Cart() {
  const { items, count, subtotal, shipping, total, clearCart } = useCart();

  return (
    <>
      <header className='cart-hero'>
        <div className='container'>
          <h1>
            Tu <span>carrito</span>
          </h1>
          <p>Revisá los productos seleccionados antes de finalizar la compra.</p>
        </div>
      </header>

      <main className='cart-page'>
        <div className='container cart-layout'>
          <section className='card cart-products'>
            <div className='cart-header'>
              <div>
                <h2>Productos agregados</h2>
                <p>Se guardan aunque cierres el navegador.</p>
              </div>
              <span className='cart-count'>{count} productos</span>
            </div>

            {items.length === 0 ? (
              <StatusMessage>
                No hay productos en el carrito. <Link to='/catalogo'>Ir al catálogo</Link>
              </StatusMessage>
            ) : (
              <div className='cart-table-wrapper'>
                <table className='cart-table'>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <CartItemRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <aside className='card cart-summary'>
            <h2>Resumen de compra</h2>
            <p className='summary-description'>
              Confirmá el total del pedido antes de continuar al checkout.
            </p>

            <div className='summary-rows'>
              <div className='summary-row'>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className='summary-row'>
                <span>Envío estimado</span>
                <strong>{formatPrice(shipping)}</strong>
              </div>
              <div className='summary-row summary-total'>
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </div>

            <div className='cart-actions'>
              {items.length > 0 && (
                <Link to='/checkout' className='button button-primary'>
                  Finalizar compra
                </Link>
              )}
              <Link to='/catalogo' className='button button-secondary'>
                Seguir comprando
              </Link>
              {items.length > 0 && (
                <button type='button' className='remove-button cart-clear' onClick={clearCart}>
                  Vaciar carrito
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default Cart;
