import { useEffect, useState } from 'react';
import OrdersTable from '../components/admin/OrdersTable';
import ProductForm from '../components/admin/ProductForm';
import ProductTable from '../components/admin/ProductTable';
import StatCard from '../components/admin/StatCard';
import StatusMessage from '../components/ui/StatusMessage';
import { ordersApi, productsApi } from '../services/api';
import { formatPrice } from '../utils/format';
import '../styles/admin.css';

function Admin() {
  const [tab, setTab] = useState('productos');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  const loadData = async () => {
    try {
      const [productsData, ordersData] = await Promise.all([
        productsApi.list(),
        ordersApi.listAll(),
      ]);
      setProducts(productsData);
      setOrders(ordersData);
      setLoadError('');
    } catch (error) {
      setLoadError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // El mensaje de éxito/error se oculta solo
  useEffect(() => {
    if (!message) return undefined;
    const timeout = setTimeout(() => setMessage(null), 3500);
    return () => clearTimeout(timeout);
  }, [message]);

  const handleSave = async productData => {
    try {
      if (editing) {
        await productsApi.update(editing._id, productData);
        setMessage({ type: 'success', text: 'Producto actualizado correctamente.' });
      } else {
        await productsApi.create(productData);
        setMessage({ type: 'success', text: 'Producto creado correctamente.' });
      }
      setEditing(null);
      await loadData();
      return true;
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      return false;
    }
  };

  const handleDelete = async product => {
    try {
      await productsApi.remove(product._id);
      if (editing?._id === product._id) setEditing(null);
      setMessage({ type: 'success', text: `"${product.nombre}" se eliminó.` });
      await loadData();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleEdit = product => {
    setEditing(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeStatus = async (order, estado) => {
    try {
      const updated = await ordersApi.updateStatus(order._id, estado);
      setOrders(current => current.map(o => (o._id === updated._id ? { ...o, estado } : o)));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const lowStock = products.filter(product => product.stock <= 10).length;
  const revenue = orders
    .filter(order => order.estado !== 'cancelado')
    .reduce((total, order) => total + order.total, 0);

  return (
    <>
      <header className='admin-hero'>
        <div className='container'>
          <h1>
            Panel de <span>Administración</span>
          </h1>
          <p>Gestioná los productos del catálogo y los pedidos de PintuNort.</p>
        </div>
      </header>

      <main className='admin-panel'>
        <div className='container'>
          {loading && <StatusMessage type='loading'>Cargando panel...</StatusMessage>}
          {loadError && <StatusMessage type='error'>{loadError}</StatusMessage>}

          {!loading && !loadError && (
            <>
              <div className='admin-stats'>
                <StatCard label='Productos' value={products.length} />
                <StatCard label='Stock bajo' value={lowStock} hint='10 unidades o menos' />
                <StatCard label='Pedidos' value={orders.length} />
                <StatCard label='Facturado' value={formatPrice(revenue)} hint='sin cancelados' />
              </div>

              <div className='admin-tabs' role='tablist'>
                <button
                  type='button'
                  role='tab'
                  aria-selected={tab === 'productos'}
                  className={tab === 'productos' ? 'active' : ''}
                  onClick={() => setTab('productos')}
                >
                  Productos
                </button>
                <button
                  type='button'
                  role='tab'
                  aria-selected={tab === 'pedidos'}
                  className={tab === 'pedidos' ? 'active' : ''}
                  onClick={() => setTab('pedidos')}
                >
                  Pedidos ({orders.length})
                </button>
              </div>

              {message && (
                <p className={`admin-message visible ${message.type}`} role='alert'>
                  {message.text}
                </p>
              )}

              {tab === 'productos' ? (
                <div className='admin-layout'>
                  <section className='card product-form-card'>
                    <h2 className='admin-section-title'>
                      {editing ? `Editando: ${editing.nombre}` : 'Crear producto'}
                    </h2>
                    <p className='admin-section-description'>
                      Los cambios se guardan en la base y se ven al instante en el catálogo.
                    </p>
                    <ProductForm
                      editing={editing}
                      onSubmit={handleSave}
                      onCancel={() => setEditing(null)}
                    />
                  </section>

                  <section className='card products-panel'>
                    <div className='products-header'>
                      <div>
                        <h2 className='admin-section-title'>Productos listados</h2>
                        <p className='admin-section-description'>Datos traídos de la API.</p>
                      </div>
                      <span className='products-count'>{products.length} productos</span>
                    </div>
                    <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
                  </section>
                </div>
              ) : (
                <section className='card products-panel'>
                  <div className='products-header'>
                    <div>
                      <h2 className='admin-section-title'>Pedidos recibidos</h2>
                      <p className='admin-section-description'>
                        Cambiá el estado a medida que preparás y entregás cada pedido.
                      </p>
                    </div>
                  </div>
                  <OrdersTable orders={orders} onChangeStatus={handleChangeStatus} />
                </section>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default Admin;
