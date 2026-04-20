# Frontend Vanilla (HTML/CSS/JS)

## Objetivo
Implementar el mismo producto que en `frontend-react`, pero usando una aproximación sin framework.

## Sprints cubiertos

- `docs/sprint-1/`: Frontend Estático (HTML/CSS) + vistas requeridas.
- `docs/sprint-3/`: Integración con backend usando JavaScript Vanilla + Fetch API + CRUD admin + carrito.

## Consigna (Vanilla)

- Consumir la misma API del backend (mismo “contrato” de endpoints).
- Implementar los mismos flujos principales (pantallas y operaciones).
- Cuidar la experiencia de usuario:
  - loading mientras se consulta el backend
  - mensajes de error claros
  - estados vacíos cuando no hay datos

## Estructura sugerida

Usá una estructura simple y legible, por ejemplo:

- `index.html`
- `src/`
  - `main.js` (arranque)
  - `api/` (funciones para llamar endpoints)
  - `views/` (renders por pantalla)
  - `components/` (componentes reutilizables, si aplica)
  - `styles/` (CSS)
- `assets/` (imágenes, íconos)

## Variables de entorno / configuración

Si necesitás configurar la URL del backend, documentá cómo setearla:

- por ejemplo en `src/config.js`
- o por `process.env` si usaran un bundler (Vite, etc.)

## Ejecución (cómo debería estar documentado)

En este README tenés que incluir:

1. `npm install` (si aplica)
2. `npm run dev` o el comando de arranque que hayan usado
3. Variables necesarias (si existen)

## Checklist

- [ ] Todas las operaciones del flujo están conectadas al backend.
- [ ] El manejo de errores no deja la UI “colgada”.
- [ ] Las pantallas están conectadas entre sí (navegación completa).

## Criterios clave (según el enunciado)

- Sprint 1: UI responsive con HTML5 semántico (sin lógica JS compleja).
- Sprint 3: reemplazar datos hardcodeados con `fetch`, manejar ID de detalle en la URL y resolver CORS configurándolo en el backend.

