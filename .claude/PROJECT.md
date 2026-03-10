# ez-inventory

## Stack Tecnológico

- **Frontend:** React 18 + TypeScript + Vite (SWC)
- **UI:** Mantine v8 + Tabler Icons + Sass/PostCSS
- **Estado:** `deepsignal` (signals reactivos) con clases custom (`SignalState`, `SignalGridClass`)
- **Auth:** Firebase Authentication (session persistence)
- **Storage:** Firebase Storage
- **Hosting:** Firebase Hosting
- **API:** Backend propio via `FetchApi` wrapper (REST, con token Firebase)
- **Otros:** Socket.IO client, react-grid-layout, FullCalendar, embla-carousel, QR code generation

## Estructura del Proyecto

```
src/
├── api/            # FetchApi wrapper, Firebase config, modelos de datos
│   ├── firebase/   # Auth, Config, Storage
│   ├── models/     # Product, Client, User, Document, etc.
│   └── action/     # Acciones API (LOGIN_USER, etc.)
├── signals/        # Sistema de estado reactivo (SignalState, SignalGridClass)
├── routes/         # Rutas con lazy loading + control de permisos
├── view/
│   ├── login/      # Login con Firebase Auth
│   ├── dashboard/  # Dashboard con react-grid-layout
│   ├── jewelry/    # Módulo principal - CRUD de productos (joyería)
│   └── layout/     # Layout, Header, Navbar, Footer
├── components/     # Componentes reutilizables (modals, carousel, vCard, etc.)
├── ezMantine/      # Componentes Mantine custom (DataTable, Grid, SearchInput, etc.)
├── types/          # Type definitions (.d.ts)
├── util/           # Utilidades (formatPhone, downloadFile, createId, etc.)
└── theme/          # Theming + icons
```

## Funcionalidad Principal

Sistema de inventario para joyería con:

- **CRUD de productos** con imágenes, SKU, precio, dimensiones, material, peso
- **DataTable** con filtros, selección de filas y acciones
- **Vista móvil** dedicada (`/add-product-from-phone`) para agregar productos desde el teléfono con cámara
- **Exportación CSV** a plataformas (Whatnot, Sellbrite)
- **Generación de QR codes**
- **Sistema de permisos** por módulos (Dashboard=1, Jewelry=100)
- **Preferencias de usuario** sincronizadas (tema, etc.)

## Rutas

| Ruta | Vista |
|------|-------|
| `/login` | Login |
| `/app/dashboard` | Dashboard |
| `/app/jewelry-test` | Inventario de joyería |
| `/mobile-view` | Vista móvil |
| `/add-product-from-phone` | Agregar producto desde teléfono |
| `/en-router` | EnRouter |

## Sistema de Estado (Signals)

- `SignalState` — Clase base que usa `deepsignal` para crear stores reactivos con props + métodos bound
- `SignalGridClass` — Extiende `SignalState` para grids con paginación, filtros y CRUD via API
- Los controllers (`JewelryController`, `LoginController`, `AppController`) son instancias de estas clases

## API

- `FetchApi(endpoint, method, data, query, strict)` — Wrapper centralizado de `fetch`
- Agrega automáticamente el token Firebase (`x-access-token`)
- Base URL desde `VITE_REACT_APP_LOCAL_URL`
- Manejo de errores: 401 → logout, otros → toast de error

## Scripts

```bash
npm run client_dev    # Dev server con --host
npm run build         # Build de producción
npm run bd            # Build + deploy a Firebase Hosting
npm run lint          # ESLint
```
