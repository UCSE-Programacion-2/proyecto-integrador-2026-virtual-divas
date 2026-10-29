# Backend PintuNort (Node.js + Express + MongoDB)

API REST que consume el frontend (vanilla y React).

## Cómo ejecutar

```bash
cd backend
npm install
cp .env.example .env   # completar MONGODB_URI y JWT_SECRET
npm run seed           # carga 10 productos + el usuario admin
npm run dev            # http://localhost:3000
```

- Documentación interactiva (Swagger): `http://localhost:3000/api-docs`
- Colección de Postman: `backend/postman/PintuNort.postman_collection.json`
  (los requests de login guardan el token solos en la variable `token` / `adminToken`).

## Variables de entorno

| Variable                                        | Para qué sirve                           | Ejemplo                        |
| ----------------------------------------------- | ---------------------------------------- | ------------------------------ |
| `PORT`                                          | Puerto del servidor                      | `3000`                         |
| `MONGODB_URI`                                   | Conexión a MongoDB (local o Atlas)       | `mongodb+srv://...`            |
| `JWT_SECRET`                                    | Firma de los tokens de sesión            | texto largo y secreto          |
| `JWT_EXPIRES_IN`                                | Duración de la sesión                    | `7d`                           |
| `CORS_ORIGIN`                                   | Frontends permitidos, separados por coma | `https://pintunort.vercel.app` |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Admin que crea `npm run seed`            | `admin@pintunort.com`          |

## Estructura (MVC)

- `config/` conexión a la base
- `src/models/` `Product`, `User` (con rol), `Cart`, `Order`
- `src/controllers/` lógica de cada recurso
- `src/routes/` endpoints
- `src/middlewares/` `auth.middleware.js` (token y rol admin) y `error.middleware.js` (404 y errores)
- `src/docs/swagger.js` documentación OpenAPI
- `scripts/seed.js` datos de prueba

## Endpoints

Las rutas marcadas con 🔒 necesitan el header `Authorization: Bearer <token>`; las marcadas con 👑 además rol `admin`.

| Método    | Ruta                          | Descripción                                                  | Códigos                 |
| --------- | ----------------------------- | ------------------------------------------------------------ | ----------------------- |
| POST      | `/api/auth/register`          | Crea un usuario (rol `user`) y devuelve `{ token, user }`    | 201, 400                |
| POST      | `/api/auth/login`             | Devuelve `{ token, user: { id, name, email, role } }`        | 200, 400, 401           |
| GET 🔒    | `/api/auth/me`                | Usuario de la sesión                                         | 200, 401                |
| GET       | `/api/products?categoria=&q=` | Lista con filtro por categoría y búsqueda por texto          | 200                     |
| GET       | `/api/products/:id`           | Detalle                                                      | 200, 404                |
| POST 👑   | `/api/products`               | Crear                                                        | 201, 400, 401, 403      |
| PUT 👑    | `/api/products/:id`           | Editar                                                       | 200, 400, 401, 403, 404 |
| DELETE 👑 | `/api/products/:id`           | Borrar                                                       | 200, 401, 403, 404      |
| GET 🔒    | `/api/cart`                   | Mi carrito `{ items, total }`                                | 200, 401                |
| PUT 🔒    | `/api/cart`                   | Reemplaza el carrito (sincronización del front)              | 200, 400                |
| DELETE 🔒 | `/api/cart`                   | Vacía el carrito                                             | 200                     |
| POST 🔒   | `/api/cart/items`             | Agrega `{ productId, quantity }`                             | 201, 400, 404           |
| PATCH 🔒  | `/api/cart/items/:productId`  | Cambia la cantidad (0 = quitar)                              | 200, 400, 404           |
| DELETE 🔒 | `/api/cart/items/:productId`  | Quita un producto                                            | 200, 404                |
| POST 🔒   | `/api/orders`                 | Simula la compra: valida y descuenta stock, vacía el carrito | 201, 400                |
| GET 🔒    | `/api/orders/mine`            | Mis pedidos                                                  | 200                     |
| GET 🔒    | `/api/orders/:id`             | Detalle (dueño o admin)                                      | 200, 404                |
| GET 👑    | `/api/orders`                 | Todos los pedidos                                            | 200, 403                |
| PATCH 👑  | `/api/orders/:id/status`      | Cambia el estado del pedido                                  | 200, 400, 404           |
| GET       | `/api/health`                 | Estado del servicio (lo usa Render)                          | 200                     |

Los errores siempre vuelven como `{ "mensaje": "..." }`.

## Deploy (Render)

Ver `docs/sprint-4/deploy-guia.md`. Resumen: el archivo `render.yaml` de la raíz crea el servicio
con `rootDir: backend`, `npm install` y `npm start`; las variables `MONGODB_URI`, `CORS_ORIGIN` y
`ADMIN_PASSWORD` se cargan a mano en el panel de Render.
