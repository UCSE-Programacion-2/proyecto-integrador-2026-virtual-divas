import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import OrderSummary from '../components/orders/OrderSummary';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';
import { PAYMENT_METHODS } from '../utils/orders';
import '../styles/checkout.css';

function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [nombre, ...resto] = (user?.name || '').split(' ');
  const [form, setForm] = useState({
    nombre,
    apellido: resto.join(' '),
    email: user?.email || '',
    telefono: '',
    direccion: '',
    ciudad: 'San Salvador de Jujuy',
    zona: '',
    notas: '',
  });
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Sin productos no hay nada que comprar
  if (!items.length && !sending) return <Navigate to='/carrito' replace />;

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSending(true);
    setError('');

    try {
      const { order } = await ordersApi.create({
        items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
        cliente: form,
        metodoPago,
      });
      clearCart();
      navigate(`/compra/${order._id}`, { replace: true });
    } catch (err) {
      setError(err.message);
      setSending(false);
    }
  };

  const field = (name, label, props = {}) => (
    <div className={`form-group ${props.full ? 'form-group-full' : ''}`}>
      <label htmlFor={`checkout-${name}`}>{label}</label>
      <input
        id={`checkout-${name}`}
        name={name}
        value={form[name]}
        onChange={handleChange}
        type={props.type || 'text'}
        placeholder={props.placeholder}
        required={props.required}
      />
    </div>
  );

  return (
    <>
      <header className='checkout-hero'>
        <div className='container'>
          <h1>
            Finalizar <span>compra</span>
          </h1>
          <p>Completá tus datos para preparar el pedido y coordinar la entrega.</p>
        </div>
      </header>

      <main className='checkout-page'>
        <div className='container checkout-layout'>
          <section className='card checkout-form-card' aria-labelledby='checkout-form-title'>
            <h2 className='checkout-section-title' id='checkout-form-title'>
              Datos del pedido
            </h2>
            <p className='checkout-section-description'>
              Es una compra simulada: no se cobra nada, pero se descuenta el stock.
            </p>

            <form id='checkout-form' className='checkout-form' onSubmit={handleSubmit}>
              <fieldset className='checkout-fieldset'>
                <legend>Datos personales</legend>
                <div className='form-grid'>
                  {field('nombre', 'Nombre', { required: true, placeholder: 'Matías' })}
                  {field('apellido', 'Apellido', { required: true, placeholder: 'Gómez' })}
                  {field('email', 'Email', {
                    type: 'email',
                    required: true,
                    placeholder: 'matias@gmail.com',
                  })}
                  {field('telefono', 'Teléfono', {
                    type: 'tel',
                    required: true,
                    placeholder: '388 000 0000',
                  })}
                </div>
              </fieldset>

              <fieldset className='checkout-fieldset'>
                <legend>Dirección de entrega</legend>
                <div className='form-grid'>
                  {field('direccion', 'Calle y número', {
                    full: true,
                    placeholder: 'Cochinoca 885',
                  })}
                  {field('ciudad', 'Ciudad')}
                  {field('zona', 'Barrio / zona', { placeholder: 'Centro' })}
                  <div className='form-group form-group-full'>
                    <label htmlFor='checkout-notas'>Indicaciones</label>
                    <textarea
                      id='checkout-notas'
                      name='notas'
                      value={form.notas}
                      onChange={handleChange}
                      placeholder='Casa con portón negro, llamar al llegar'
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className='checkout-fieldset'>
                <legend>Método de pago</legend>
                <div className='payment-options'>
                  {PAYMENT_METHODS.map(method => (
                    <label
                      key={method.value}
                      htmlFor={`pago-${method.value}`}
                      className={`payment-option ${metodoPago === method.value ? 'active' : ''}`}
                    >
                      <input
                        id={`pago-${method.value}`}
                        type='radio'
                        name='metodoPago'
                        value={method.value}
                        checked={metodoPago === method.value}
                        onChange={() => setMetodoPago(method.value)}
                        className='payment-radio'
                      />
                      <span className='payment-dot' />
                      <div>
                        <h3>{method.title}</h3>
                        <p>{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </fieldset>
            </form>
          </section>

          <aside className='card order-summary' aria-labelledby='order-summary-title'>
            <h2 className='checkout-section-title' id='order-summary-title'>
              Resumen del pedido
            </h2>
            <p className='checkout-section-description'>Productos seleccionados para la compra.</p>

            <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />

            {error && (
              <p className='checkout-error' role='alert'>
                {error}
              </p>
            )}

            <div className='checkout-actions'>
              <button
                type='submit'
                form='checkout-form'
                className='button button-primary'
                disabled={sending}
              >
                {sending ? 'Procesando...' : 'Confirmar compra'}
              </button>
              <Link to='/carrito' className='button button-secondary'>
                Volver al carrito
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default Checkout;
