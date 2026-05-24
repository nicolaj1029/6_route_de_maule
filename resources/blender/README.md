# Blender Asset Flow

Brug `resources/blender/` til alle arbejdsfiler fra Blender.

Mappeformål:

- `scenes/`
  Gem dine `.blend`-filer her.
- `textures/`
  Gem rå teksturer, materialebilleder, decals og HDRI-referencer her.
- `renders/`
  Gem præ-renderede stills, preview-billeder og evt. hero-udsnit her.
- `exports/`
  Gem eksporterede `.glb`/`.gltf`-filer her, før de kopieres til frontendens public-mapper.
- `references/`
  Gem moodboards, screenshots, plantegninger, cadastre-klip og andre referencefiler her.

Det, der skal på websiden, kopieres herfra til:

- `public/models/herbeville/public/models/`
  Kun deploy-klare `.glb`-filer.
- `public/models/herbeville/public/images/`
  Kun deploy-klare hero-billeder og preview-renders.

Kopier ikke Blender-installationsmappen ind i projektet.
Den mappe indeholder programfiler, ikke projektassets.
