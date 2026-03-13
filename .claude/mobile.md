# Mobile Codebase Documentation

## Overview
React Native (Expo SDK 55) inventory management app. Dark-themed UI (#1a1b1e background). Uses Firebase Auth + Storage, REST API backend via ngrok tunnel.

## File Structure
```
mobile/
├── App.tsx                          # Root: AuthProvider + NavigationContainer + Toast
├── index.ts                         # Expo entry point (registerRootComponent)
├── app.json                         # Expo config (portrait, light UI style)
├── package.json
├── tsconfig.json                    # extends expo/tsconfig.base, strict: true
└── src/
    ├── api/
    │   ├── auth.ts                  # loginUser(), logoutUser()
    │   └── fetchApi.ts              # fetchApi() - central API client
    ├── components/
    │   ├── SearchInput.tsx          # Forwardref search bar with validation
    │   └── SelectDropdown.tsx       # Modal-based dropdown, lazy-loads options from API
    ├── config/
    │   └── firebase.ts             # Firebase init (auth + storage exports)
    ├── navigation/
    │   ├── AppNavigator.tsx         # Bottom tabs + stack navigators
    │   └── AuthContext.tsx          # Auth state via React Context
    ├── screens/
    │   ├── LoginScreen.tsx          # Email/password login
    │   ├── ProductListScreen.tsx    # Paginated product list with search + FAB
    │   ├── ProductDetailScreen.tsx  # Read-only product view with image carousel
    │   ├── AddProductScreen.tsx     # Create/edit product (2-phase AI workflow)
    │   ├── ScanScreen.tsx           # QR code scanner for camera sessions
    │   ├── CameraScreen.tsx         # Photo capture + upload for QR sessions
    │   └── SettingsScreen.tsx       # Account info + logout
    └── utils/
        ├── compressImage.ts         # Resize to 920px width, JPEG 0.8 quality
        └── uploadPhoto.ts           # Upload to Firebase Storage + get download URL
```

## Navigation

### Root (App.tsx)
- `RootStack` (NativeStackNavigator): conditional auth routing
  - Logged in → `App` (AppNavigator)
  - Logged out → `Login` (LoginScreen)

### AppNavigator (Bottom Tabs)
- **ProductsTab** → ProductStackNavigator
  - `ProductList` (no header)
  - `ProductDetail` (header: "Product Detail")
  - `AddProduct` (header: dynamic "Edit Product" or empty)
  - `Scan` (no header)
  - `Camera` (no header)
- **SettingsTab** → SettingsStackNavigator
  - `SettingsMain` (no header)

### Navigation Types
```typescript
type ProductStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
  AddProduct: { productId?: number } | undefined;
  Scan: undefined;
  Camera: { sessionId: string };
};
type SettingsStackParamList = { SettingsMain: undefined };
type TabParamList = { ProductsTab: undefined; SettingsTab: undefined };
```

## API Layer

### fetchApi (src/api/fetchApi.ts)
- Base URL: `https://api.pancho.ngrok.io/api/`
- Auto-attaches Firebase ID token via `x-access-token` header
- Supports query params (objects/arrays JSON-stringified)
- Signature: `fetchApi(endpoint, method?, data?, query?)`

### API Endpoints Used
| Endpoint | Method | Screen | Purpose |
|---|---|---|---|
| `login` | POST | AuthContext | Verify user in backend DB |
| `v1/product` | GET | ProductListScreen | List products (paginated, filterable) |
| `v1/product/:id` | GET | ProductDetailScreen, AddProductScreen | Get single product |
| `v1/product` | POST | AddProductScreen | Create product |
| `v1/product` | PUT | AddProductScreen | Update product |
| `v1/ai/product_description` | GET | AddProductScreen | AI-generate description from image |
| `v1/ai/product_photos` | POST | AddProductScreen | AI-generate product photos |
| `v1/asset/product_material` | GET | SelectDropdown | Material options |
| `v1/asset/product_type` | GET | SelectDropdown | Type options |
| `v1/asset/product_gem_type` | GET | SelectDropdown | Gem type options |
| `user/verify/2fa` | GET | ScanScreen | QR code 2FA verification |

### Auth (src/api/auth.ts)
- `loginUser(email, password)` → Firebase signIn → POST to `login` endpoint → returns discriminated union `LoginResult | LoginError`
- `logoutUser()` → Firebase signOut
- Error mapping for `auth/invalid-credential`, `auth/too-many-requests`, `auth/user-not-found`

## Authentication (AuthContext)

- React Context providing `{ isLoading, isLoggedIn, user, login, logout }`
- `onAuthStateChanged` listener auto-restores session on app start
- On Firebase user detected → POST `login` to validate in backend DB
- If `dbUser.newUser` → treats as unauthorized (returns login error)

## Screens Detail

### LoginScreen
- Email + password form with validation
- KeyboardAvoidingView (iOS: padding, Android: height)
- Loading spinner on submit, error display

### ProductListScreen
- FlatList with pull-to-refresh
- SearchInput component (min 3 chars, alphanumeric only)
- Pagination: page nav + page size picker modal (10/20/50/100)
- Product cards: image thumbnail (90x90), title, SKU, price (green), quantity, material
- Edit button (pencil icon) → navigates to AddProduct with productId
- FAB button → navigates to AddProduct (create mode)
- Filters sent as `JSON.stringify([{ id: 'product_title', value: term }])`

### ProductDetailScreen
- Horizontal paging image carousel (full screen width, 300px height)
- Product info: title, SKU, price, quantity
- Details grid: material, type, gem, color, weight (g→oz conversion), dimensions
- Tags as pills
- Description text

### AddProductScreen (~1350 lines, largest file)
Two modes: **Create** and **Edit** (determined by `route.params.productId`)

**Create Mode - Two Phases:**
1. **Phase 1 (aiLoading=true):** Select material/type/gem/labour → take description photo → tap "Description" → AI generates title, description options, color, weight, dimensions, tags
2. **Phase 2 (aiLoading=false):** Edit AI-generated fields → add product images → select description → tap "To Db" to save

**Edit Mode:** Loads existing product data, skips AI phase, shows "Save" button

**Features:**
- Camera integration (expo-camera CameraView)
- Image picker (expo-image-picker) for gallery selection (multi-select up to 4 for AI raw)
- Web file input fallback (Platform.OS === 'web')
- SelectDropdown components for material, type, gem (lazy-loaded from API)
- Weight conversion: oz input → stored as grams (28.3495 g/oz)
- Tag management (add/remove pills)
- AI Photo Generator: upload raw photos → POST to `v1/ai/product_photos` → select generated photos to add
- Editable description cards with radio selection
- Bottom bar: Cancel (red) + Description/Save (blue/green)

### ScanScreen
- QR code scanner using expo-camera barcode scanning
- Parses QR payload: `{ sessionId, userId, code, apiUrl }`
- Verifies 2FA via `apiUrl + user/verify/2fa`
- Signs in with Firebase custom token
- Navigates to Camera screen with sessionId

### CameraScreen
- Full-screen camera with capture button
- Photo thumbnail strip (horizontal FlatList) showing upload status
- Each photo: capture → upload to `photo-session/{sessionId}` in Firebase Storage
- Upload status indicators: spinner (uploading), green "OK" badge (uploaded)
- Top bar: back button + photo count badge

### SettingsScreen
- Displays user email
- Logout button (red, pinned to bottom)

## Components

### SearchInput
- Forwarded ref with `reset()` method
- Input validation: min 3 chars, alphanumeric + spaces only
- Dynamic placeholder for validation errors
- Search icon (submit) + clear icon (X)

### SelectDropdown
- Modal-based dropdown (slides from bottom)
- Lazy-loads options from API on first open
- Searchable filter
- Props: `{ label, apiUrl, iterator, value, onChange, searchable?, required?, hasError? }`
- Iterator maps API response fields: `{ label: 'asset_option_name', value: 'asset_option_id' }`

## Utils

### compressImage.ts
- Resizes image to max 920px width
- JPEG quality 0.8
- Uses `expo-image-manipulator`

### uploadPhoto.ts
- `uploadToFirebase(localUri, path)` → compress → fetch blob → upload to Firebase Storage → return `{ name, url }`
- `uploadPhoto(localUri, sessionId)` → uploads to `photo-session/{sessionId}`
- Random 20-char alphanumeric ID for file names

## Firebase Config
- Project: `ez-soft-97beb`
- Auth: email/password + custom token (for QR scan flow)
- Storage: product images, AI raw images, photo sessions

## Data Models

### Product (from API)
```typescript
interface Product {
  product_id: number;
  product_title: string;
  product_sku: string;
  product_price: number;
  product_material: string;
  product_type: string;
  product_gem_type: string;
  product_color: string;
  product_quantity: number;
  product_weight_g: number;
  product_height: number;
  product_width: number;
  product_length: number;
  product_description: string;
  product_crafting_price: number;
  product_tag: string[];
  product_image_url: Array<{
    document_url: string;
    document_primary: boolean;
    document_type: string;
  }>;
}
```

### QR Payload (ScanScreen)
```typescript
interface QrPayload {
  sessionId: string;
  userId: string;
  code: string;
  apiUrl: string;
}
```

### Upload Result
```typescript
interface UploadResult {
  name: string;
  url: string;
}
```

## Styling
- All styles use `StyleSheet.create()` co-located at bottom of each file
- Dark theme palette:
  - Background: `#1a1b1e` (main), `#25262b` (cards/inputs), `#141517` (tab bar)
  - Borders: `#373a40`
  - Text: `#fff` (primary), `#c1c2c5` (secondary), `#868e96` (muted)
  - Accent: `#228be6` (blue/primary action)
  - Success: `#51cf66` (prices), `#40c057` (checkmarks), `#0ca678` (save buttons)
  - Error: `#e03131` (red), `#fa5252` (error text)
  - AI: `#7950f2` (purple, generate button)
- Icons: `@expo/vector-icons` (Ionicons)
- Toast notifications: `react-native-toast-message`

## Key Dependencies
| Package | Version | Purpose |
|---|---|---|
| expo | ~55.0.0 | Framework |
| react-native | 0.83.2 | Core |
| react | 19.2.0 | UI library |
| firebase | ^11.0.0 | Auth + Storage |
| @react-navigation/native | ^7.1.33 | Navigation core |
| @react-navigation/native-stack | ^7.14.4 | Stack navigator |
| @react-navigation/bottom-tabs | ^7.15.5 | Tab navigator |
| expo-camera | ~55.0.9 | Camera + barcode scanning |
| expo-image-picker | ~55.0.11 | Gallery image selection |
| expo-image-manipulator | ~55.0.9 | Image compression/resize |
| react-native-toast-message | ^2.3.3 | Toast notifications |
| @react-native-async-storage/async-storage | 2.2.0 | Local storage (installed, not directly used in code) |
| react-native-safe-area-context | ~5.6.0 | Safe area insets |
| react-native-screens | ~4.23.0 | Native screen containers |

## State Management
- **AuthContext** (React Context) for auth state (isLoading, isLoggedIn, user)
- **Local useState** in each screen for component-level state
- No global state library (no Redux/Zustand)

## Notes
- All screens use default exports
- Components (SearchInput, SelectDropdown) use named exports
- Web platform support via `Platform.OS === 'web'` checks in AddProductScreen
- No `.env` file — Firebase config and API URL are hardcoded
- TypeScript strict mode enabled
