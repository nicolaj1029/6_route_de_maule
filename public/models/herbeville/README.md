# 6 Route Maule - Herbeville
### Prototype de salgsside v2

React/Vite-salgsside for byggegrunden i Herbeville, hostet af CakePHP lokalt og
også klar til statisk deploy via GitHub Pages.

## Kom i gang

```bash
npm install
npm run dev
npm run build
npm run build:pages
```

- `npm run dev` starter lokal Vite-udvikling.
- `npm run build` skriver den lokale Cake-build til `webroot/herbeville-app/`.
- `npm run build:pages` skriver en statisk Pages-build til `public/models/herbeville/dist/`.

## Filstruktur

```text
public/models/herbeville/
  public/
    images/           <- Hero-fotos og renders
    models/           <- Web-klare GLB-filer
  src/
    components/
    config/
  index.html
  package.json
  vite.config.js
```

## Aktivering af moduler

### 1. Rigtige fotos
Placer billeder i:

```text
public/models/herbeville/public/images/
```

Nu bruges der allerede:

```text
terrain-01.png
terrain-02.png
```

### 2. GLB-modeller
Placer Blender-eksporter i:

```text
public/models/herbeville/public/models/
```

Siden understoetter nu:

```text
villa-moderne.glb
maison-normande.glb
chalet-bois.glb
bungalow.glb
parcel-a-maison-normande.glb
parcel-b-villa-moderne.glb
site-context.glb
```

### 3. Kontaktformular
Opdater `formspreeId` i `src/config/property.js`.

### 4. AI-assistent
Frontend kalder forst den lokale Cake-endpoint:

```text
POST /api/design-assistant
```

Hvis endpointet ikke findes, falder frontend automatisk tilbage til lokal
regelbaseret fortolkning. Det gor GitHub Pages-versionen brugbar uden backend.

### 5. 3D og performance
- `model-viewer` loades kun ved aktivering af 3D-sektionen.
- Vite bruger base-aware asset paths via `import.meta.env.BASE_URL`.
- Brugeren kan nu skifte mellem husmodel, parcel-variant og site-context, nar de findes.

### 6. GitHub Pages deploy
Workflow ligger i:

```text
.github/workflows/deploy-herbeville-pages.yml
```

For at aktivere:

1. Gaa til repoets `Settings -> Pages`
2. Vaelg `Build and deployment: GitHub Actions`
3. Push til `main`
