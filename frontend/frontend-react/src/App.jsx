import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthForm from './pages/AuthForm';
import Cart from './pages/Cart';
import Home from './pages/Home';

function ProductDetail() {
  const { id } = useParams();
  return <main className="container home-page"><h1>Detalle del producto</h1><p>Producto seleccionado: {id}</p></main>;
}

function NotFound() {
  return <main className="container home-page"><h1>404</h1><p>La página que buscás no existe.</p><Link to="/">Volver al Home</Link></main>;
}

function Navbar() {
  const { items } = useCart();
  return <nav className="container cart-navbar"><Link to="/">PintuNort</Link><Link to="/carrito">Carrito ({items.length})</Link></nav>;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthForm mode="login" />} />
          <Route path="/register" element={<AuthForm mode="register" />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<Home />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
