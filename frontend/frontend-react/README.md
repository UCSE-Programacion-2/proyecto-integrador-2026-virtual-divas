# Frontend React (Sprint 4)

SPA de PintuNort hecha con React + Vite + React Router DOM. Consume la misma API que `frontend-vanilla`
(que se mantiene como referencia del Sprint 3).

## Cómo ejecutar

```bash
cd frontend/frontend-react
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api
npm run dev            # http://localhost:5173
npm run build          # build de producción en dist/
```

| Variable | Descripción |
| --- | --- |
| `VITE_API_URL` | URL base de la API (con `/api` al final). En Vercel se carga en *Environment Variables*. |

## Estructura

```
src/
  main.jsx               BrowserRouter + AuthProvider + CartProvider
  App.jsx                rutas públicas, protegidas y de admin
  services/api.js        cliente HTTP único (token, errores) y endpoints
  context/
    AuthContext.jsx      sesión (login, registro, logout, rol)
    CartContext.jsx      carrito global (localStorage + sincronizado con la API)
  components/
    layout/              Navbar, Footer, Layout, ScrollToTop
    products/            ProductCard, ProductGrid
    cart/                CartItemRow, QuantityControl, AddToCartButton
    orders/              OrderSummary
    admin/               ProductForm, ProductTable, OrdersTable, StatCard
    auth/                ProtectedRoute (sesión y adminOnly)
    ui/                  StatusMessage (cargando / error / vacío)
  pages/                 Home, Catalog, ProductDetail, Login, Register, Cart,
                         Checkout, OrderSuccess, MyOrders, Admin, NotFound
  styles/                CSS migrado de frontend-vanilla + estilos nuevos
  utils/                 formato de precios, categorías, propTypes
```

## Rutas

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | Home (banner, búsqueda, categorías, destacados) | público |
| `/catalogo?q=&categoria=` | Catálogo con búsqueda y filtros | público |
| `/producto/:id` | Detalle | público |
| `/login`, `/registro` | Formularios controlados | público |
| `/carrito` | Carrito | público |
| `/checkout` | Simular compra | con sesión |
| `/compra/:id` | Confirmación del pedido | con sesión |
| `/mis-compras` | Historial | con sesión |
| `/admin` | Dashboard + CRUD de productos + pedidos | solo rol `admin` |
| `*` | 404 | público |

## Checklist

- [x] La UI refleja el estado de la API (loading/error/empty) con `StatusMessage`.
- [x] SPA sin recargas (React Router DOM) y rewrite para producción (`vercel.json` / `public/_redirects`).
- [x] Componentes con props validadas (PropTypes).
- [x] `useState` en formularios, `useEffect` para los fetch, Context API para sesión y carrito.
- [x] Ruta protegida de admin.
