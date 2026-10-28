import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, total, loading, error, removeItem, updateQuantity, clear } = useCart();

  if (loading) return <main className="container page"><p>Cargando carrito...</p></main>;

  return (
    <main className="container page cart-page">
      <h1>Carrito</h1>
      {error && <p className="form-error">{error}</p>}
      {!items.length ? <p>Tu carrito está vacío.</p> : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.productId} className="cart-item">
                <span>{item.nombre || item.name || item.productId}</span>
                <input type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.productId, Number(event.target.value))} />
                <button type="button" onClick={() => removeItem(item.productId)}>Quitar</button>
              </li>
            ))}
          </ul>
          <strong>Total: ${total}</strong>
          <button type="button" onClick={clear}>Vaciar carrito</button>
        </>
      )}
      <Link to="/">Volver al inicio</Link>
    </main>
  );
}
