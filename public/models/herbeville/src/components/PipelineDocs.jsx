import styles from './PipelineDocs.module.css'

const STEPS = [
  {
    title: 'Hero photos - WebP/AVIF',
    body: `Placer 3 photos dans public/models/herbeville/public/images/ nommees terrain-01.webp, terrain-02.webp, terrain-03.webp.
Format recommande: 1600x900px, max 200KB chacune.
Generer variantes AVIF avec squoosh.app ou sharp-cli.
Les photos remplaceront automatiquement l'illustration SVG de secours.`,
  },
  {
    title: 'GLB Blender -> model-viewer',
    body: `Exporter depuis Blender: File -> Export -> glTF 2.0 (.glb)
Parametres recommandes:
  - Compression: Draco
  - Textures: max 1024x1024px
  - LOD: high <3MB, low <800KB
Placer les fichiers dans public/models/herbeville/public/models/
et mettre a jour src/config/houseOptions.js.`,
  },
  {
    title: 'Cake route + Formspree',
    body: `Le frontend est source dans public/models/herbeville
et build dans webroot/herbeville-app.
URL d'acces cote Cake: /herbeville

Pour le formulaire:
1. Creer un compte sur formspree.io
2. Copier l'ID du form
3. Remplacer VOTRE_FORMSPREE_ID dans src/config/property.js`,
  },
  {
    title: 'CesiumJS + Google 3D Tiles',
    body: `Le composant MapSection garde un slot simple pour une integration future.
Etapes prevues:
1. Ajouter Cesium dans index.html ou via import dedie
2. Initialiser le viewer seulement sur interaction
3. Brancher Google Photorealistic 3D Tiles
4. Masquer le fallback statique une fois la scene chargee`,
  },
  {
    title: 'Build local vers webroot',
    body: `npm install
npm run build

Le build Vite est envoye dans webroot/herbeville-app/
et servi sous le meme domaine que CakePHP.

Le module AI appelle actuellement la route locale:
POST /api/design-assistant`,
  },
]

export default function PipelineDocs() {
  return (
    <section className={styles.section}>
      <span className="section-label" style={{ color: 'var(--gold)' }}>Documentation technique</span>
      <h2 className={styles.title}>Pipeline d&apos;integration</h2>
      <p className={styles.body}>Guide d&apos;activation des modules de production.</p>

      <div className={styles.grid}>
        {STEPS.map((step, index) => (
          <div key={step.title} className={styles.card}>
            <div className={styles.cardHead}>
              <div className={styles.num}>{index + 1}</div>
              <span className={styles.cardTitle}>{step.title}</span>
            </div>
            <pre className={styles.cardBody}>{step.body}</pre>
          </div>
        ))}
      </div>
    </section>
  )
}
