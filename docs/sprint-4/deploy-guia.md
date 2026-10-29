# Guía de deploy PintuNort (paso a paso)

Orden: **1) Base de datos → 2) Backend en Render → 3) Frontend en Vercel → 4) Volver a Render a cargar CORS**.
Todo es gratis. Lo hace una sola persona con la cuenta de GitHub que tenga acceso al repo.

## 1) MongoDB Atlas (base en la nube)

1. Entrar a https://www.mongodb.com/cloud/atlas y crear un cluster **M0 (Free)**.
2. *Database Access*: crear un usuario (ej. `pintunort`) con contraseña sin caracteres raros.
3. *Network Access*: agregar `0.0.0.0/0` (Render no tiene IP fija).
4. *Connect → Drivers*: copiar el string y agregarle el nombre de la base:
   `mongodb+srv://pintunort:CLAVE@cluster0.xxxxx.mongodb.net/pintunort?retryWrites=true&w=majority`
5. Cargar los datos de prueba desde la compu (una sola vez):
   ```bash
   cd backend
   # en backend/.env poner MONGODB_URI=<string de Atlas> y ADMIN_PASSWORD=<clave del admin>
   npm run seed
   ```

## 2) Backend en Render

1. https://render.com → *New* → **Blueprint** → elegir el repo. Render lee `render.yaml` de la raíz.
   (Alternativa manual: *New → Web Service*, Root Directory `backend`, Build `npm install`, Start `npm start`.)
2. Completar las variables que pide:
   - `MONGODB_URI` = string de Atlas
   - `ADMIN_PASSWORD` = la misma clave usada en el seed
   - `CORS_ORIGIN` = por ahora `http://localhost:5173` (se cambia en el paso 4)
   - `JWT_SECRET` lo genera Render solo.
3. Esperar el deploy y probar: `https://pintunort-api.onrender.com/api/health` → `{"status":"ok"}`.
   La documentación queda en `https://pintunort-api.onrender.com/api-docs`.

> El plan gratis "se duerme" tras 15 min sin uso y tarda ~50 s en despertar.
> **Antes del Demo Day abrir `/api/health` 2 minutos antes de presentar.**

## 3) Frontend React en Vercel

1. https://vercel.com → *Add New → Project* → importar el repo.
2. **Root Directory**: `frontend/frontend-react` (Vercel detecta Vite solo).
3. *Environment Variables*: `VITE_API_URL` = `https://pintunort-api.onrender.com/api`
4. *Deploy*. Queda algo como `https://pintunort.vercel.app`.
   `vercel.json` ya tiene el rewrite para que recargar `/catalogo` o `/admin` no dé 404.

> Si cambian `VITE_API_URL` hay que hacer **Redeploy**: Vite la mete en el build.

## 4) Cerrar el círculo (CORS)

En Render → *Environment* → `CORS_ORIGIN`:
```
https://pintunort.vercel.app,https://ucse-programacion-2.github.io,http://localhost:5173
```
(Guardar → Render redeploya solo.)

Además, en `frontend/frontend-vanilla/js/config.js` reemplazar `PRODUCTION_API_URL` por la URL real de
Render para que la versión de GitHub Pages también funcione.

## 5) Checklist final

- [ ] `npm run build` en `frontend/frontend-react` sin errores (también lo corre el workflow `CI`).
- [ ] `https://<render>/api/health` responde.
- [ ] En la URL de Vercel: registrarse, buscar, agregar al carrito, comprar.
- [ ] Cerrar el navegador, volver a abrir: sigue logueado y el carrito/compras siguen ahí.
- [ ] Login con el admin → `/admin` muestra productos y pedidos.
- [ ] README de la raíz con las URLs reales.
- [ ] Video de respaldo grabado.

## Problemas típicos

| Síntoma | Causa | Solución |
| --- | --- | --- |
| "No se pudo conectar con el servidor" | Render dormido o URL mal | Abrir `/api/health`, revisar `VITE_API_URL` y redeploy |
| Error de CORS en la consola | Falta la URL de Vercel en `CORS_ORIGIN` | Agregarla (sin `/` al final) |
| 404 al recargar `/catalogo` | Falta el rewrite | Verificar que `vercel.json` esté en `frontend/frontend-react` |
| Render falla al arrancar | Falta `MONGODB_URI` o `JWT_SECRET` | Revisar variables en Render |
| No puedo entrar al admin | No se corrió el seed contra Atlas | Correr `npm run seed` con `MONGODB_URI` de Atlas |
