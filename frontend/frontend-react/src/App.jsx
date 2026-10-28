import { BrowserRouter, Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function Layout({ children }) {
  return (
    <>
      <header className="navbar">
        <nav className="container navbar-content">
          <Link className="navbar-brand" to="/">Pintu<span>Nort</span></Link>
          <div className="navbar-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/producto/1">Detalle</Link>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}

function Home() {
  return <main className="container page"><h1>Home</h1><p>Bienvenido a PintuNort.</p></main>;
}

function Login() {
  return <main className="container page"><h1>Login</h1><p>La pantalla de autenticación se integra en la issue #51.</p></main>;
}

function ProductDetail() {
  const { id } = useParams();
  return <main className="container page"><h1>Detalle del producto</h1><p>Producto seleccionado: {id}</p></main>;
}

function NotFound() {
  return <main className="container page"><h1>404</h1><p>La página que buscás no existe.</p><Link to="/">Volver al Home</Link></main>;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
