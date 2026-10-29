import { Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/catalogo' element={<Catalog />} />
        <Route path='/producto/:id' element={<ProductDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registro' element={<Register />} />
        <Route path='/carrito' element={<Cart />} />
        {/* Rutas que necesitan sesión iniciada */}
        <Route
          path='/checkout'
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path='/compra/:id'
          element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path='/mis-compras'
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida: solo usuarios con rol admin */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute adminOnly>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
