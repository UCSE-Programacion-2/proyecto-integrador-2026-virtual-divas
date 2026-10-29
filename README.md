# PintuNort / VirtualDivas - Programación II 2026

Tienda online para la pinturería **PintuNort** (San Salvador de Jujuy): catálogo con búsqueda, carrito,
compra simulada, cuentas de usuario y panel de administración.

## 🚀 Producción (Sprint 4)

| | URL |
| --- | --- |
| Frontend (React, Vercel) | https://pintunort.vercel.app ← reemplazar por la URL real |
| Backend (API, Render) | https://pintunort-api.onrender.com/api/health ← reemplazar |
| Documentación de la API | https://pintunort-api.onrender.com/api-docs |
| Frontend vanilla (Sprint 3, GitHub Pages) | https://ucse-programacion-2.github.io/proyecto-integrador-2026-virtual-divas/ |
| Video de respaldo | Próximamente |

Usuario admin para la demo: `admin@pintunort.com` (la contraseña la tiene el equipo).

## 🧱 Stack

- **Frontend**: React 18 + Vite + React Router DOM + Context API (`frontend/frontend-react`)
- **Legado**: HTML/CSS/JS vanilla con Fetch (`frontend/frontend-vanilla`)
- **Backend**: Node.js + Express + Mongoose + JWT + bcrypt (`backend`)
- **Base de datos**: MongoDB Atlas
- **Deploy**: Vercel (front) + Render (API) · CI con GitHub Actions

## 👥 Integrantes

* Castillo, Marco A.
* Mendoza, J. Francisco - [GitHub Profile](https://github.com/playerov)
* Sajama, Maximiliano - [GitHub Profile](https://github.com/matiasajama)

## 🏢 Cliente Real Elegido

* Nombre: PintuNort
* Rubro: Pinturería
* Dirección: Cochinoca 885, San Salvador de Jujuy
* Justificación: El catálogo de una pinturería incluye productos con múltiples
  atributos (nombre, marca, tipo, color, precio, stock, imagen), lo que justifica
  un CRUD completo. Permite gestionar productos por categoría (pinturas de interior,
  exterior, esmaltes, accesorios), actualizar precios y stock desde un panel administrador.

## ▶️ Cómo ejecutar en local

```bash
# Backend
cd backend && npm install && cp .env.example .env && npm run seed && npm run dev
# Frontend React (otra terminal)
cd frontend/frontend-react && npm install && cp .env.example .env && npm run dev
```

Más detalle en `docs/como-ejecutar.md`, `backend/README.md` y `frontend/frontend-react/README.md`.
Guía de deploy: `docs/sprint-4/deploy-guia.md`.

## 🎤 Flujo del Demo Day

1. Crear un usuario nuevo (`/registro`).
2. Buscar un producto (buscador del Home o `/catalogo`).
3. Agregarlo al carrito (desde la tarjeta o el detalle).
4. Simular la compra (`/checkout` → confirmación).
5. Cerrar y abrir el navegador: la sesión, el carrito y "Mis compras" siguen ahí
   (localStorage + carrito y pedidos guardados en MongoDB).
6. Extra: entrar como admin y ver el pedido en `/admin`.

## 📌 Tablero y videos

* Tablero de GitHub Projects: https://github.com/orgs/UCSE-Programacion-2/projects/41/views/1
* Video Sprint 1: https://drive.google.com/file/d/1ZpSSECuKeV9jJd9f4MNsHiVgck0M2u3G/view?usp=sharing
* Video Sprint 2: https://drive.google.com/file/d/1rpNx0tBH1NlhFmxzDQdOwxz2Ekeub1K3/view?usp=sharing

## 📝 Reglas de Contribución

* Uso de Git Flow.
* PRs requieren 2 aprobaciones.
* No se acepta código sin Issue asociada.
* Guía para alumnos (commits y protecciones de PR): `docs/como-ejecutar.md` (sección "Guía para alumnos: commits y PRs").

## 📹 Sprint Review (todos los sprints)

* Guía unificada: `docs/sprint-review/README.md`
* Plantilla para equipos: `docs/sprint-review/sprint-review-template.md`
* Rúbrica de evaluación: `docs/sprint-review/sprint-review-rubrica.md`
* Checklist estudiantes: `docs/sprint-review/sprint-review-checklist-estudiantes.md`
* Checklist docentes: `docs/sprint-review/sprint-review-checklist-docentes.md`
