# 6 Route Maule - Herbeville
### Prototype de salgsside v2

React/Vite-salgsside for byggegrunden i Herbeville, hostet af CakePHP og bygget til `webroot/herbeville-app/`.

---

## Kom i gang

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starter lokal Vite-udvikling.

`npm run build` skriver den kompilerede app til:

```bash
webroot/herbeville-app/
```

og Cake-routen `/herbeville` peger derefter videre til buildet.

---

## Filstruktur

```text
public/models/herbeville/
  public/
    images/           <- Hero-fotos
    models/           <- GLB-filer fra Blender
  src/
    components/
    config/
  index.html
  package.json
  vite.config.js
```

---

## Aktivering af moduler

### 1. Rigtige fotos
Placer 3 filer i `public/models/herbeville/public/images/`:

```text
terrain-01.webp
terrain-02.webp
terrain-03.webp
```

### 2. GLB-modeller
Placer Blender-eksporter i `public/models/herbeville/public/models/`:

```text
villa-moderne.glb
maison-normande.glb
chalet-bois.glb
bungalow.glb
```

### 3. Kontaktformular
Opdater `formspreeId` i `src/config/property.js`.

### 4. AI-assistent
Frontend kalder nu den lokale Cake-endpoint:

```text
POST /api/design-assistant
```

Det er en lokal regelmotor nu, men endpointet kan senere erstattes af en rigtig LLM-proxy uden at ændre frontend-kontrakten.

### 5. 3D og performance
- `model-viewer` loades kun ved aktivering af 3D-sektionen.
- Vite buildes med relative asset-paths, saa appen virker baade i webroot og under en undermappe.
- Assets refereres via `import.meta.env.BASE_URL`, så de virker under Cake-webroot.

---

## Tech stack

- React 18 + Vite 5
- CSS Modules
- CakePHP som host for build og lokal AI-endpoint
- `@google/model-viewer` on demand
- Formspree til kontaktformular
- Cesium-klar map-slot til senere
