# 6 Route de Maule

Prototype for en salgsorienteret, interaktiv grundside for:

- `6 Route Maule, Herbeville, France`
- koordinater `48.90785295, 1.87884956`

Repoet bestar af to lag:

- en CakePHP-wrapper, der hoster frontend-buildet lokalt via `/herbeville`
- en React/Vite-frontend i `public/models/herbeville`

## Lokale URL'er

- Cake entrypoint: `http://localhost/6_route_de_Maule/herbeville`
- direkte build: `http://localhost/6_route_de_Maule/herbeville-app/index.html`

## Frontend

Frontend-kilde ligger her:

```text
public/models/herbeville
```

Lokal Cake-build:

```bash
cd public/models/herbeville
npm install
npm run build
```

Det skriver til:

```text
webroot/herbeville-app
```

Statisk GitHub Pages-build:

```bash
cd public/models/herbeville
npm run build:pages
```

Det skriver til:

```text
public/models/herbeville/dist
```

## Blender asset flow

Arbejdsmateriale:

```text
resources/blender/scenes
resources/blender/renders
resources/blender/exports
resources/blender/textures
resources/blender/references
```

Kun web-klare filer kopieres til:

```text
public/models/herbeville/public/images
public/models/herbeville/public/models
```

## GitHub Pages

Workflow:

```text
.github/workflows/deploy-herbeville-pages.yml
```

For at aktivere deployment:

1. Gaa til `Settings -> Pages`
2. Vaelg `Build and deployment: GitHub Actions`
3. Push til `main`
