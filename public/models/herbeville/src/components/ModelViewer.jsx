import { useEffect, useState } from 'react'
import { HOUSE_STYLES, ROOF_STYLES, SITE_SCENES } from '../config/houseOptions.js'
import styles from './ModelViewer.module.css'

let modelViewerScriptPromise

async function ensureModelViewerLoaded() {
  if (customElements.get('model-viewer')) {
    return
  }

  if (!modelViewerScriptPromise) {
    modelViewerScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.type = 'module'
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Unable to load model-viewer'))
      document.head.appendChild(script)
    })
  }

  await modelViewerScriptPromise
}

export default function ModelViewer({ config }) {
  const [active, setActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sceneKey, setSceneKey] = useState(`house:${config.house}`)

  const houseOpt = HOUSE_STYLES.find((item) => item.key === config.house) || HOUSE_STYLES[0]
  const roofOpt = ROOF_STYLES.find((item) => item.key === config.roof) || ROOF_STYLES[0]
  const sceneOptions = buildSceneOptions(houseOpt)
  const activeScene = sceneOptions.find((scene) => scene.key === sceneKey) || sceneOptions[0]

  const glbReady = Boolean(activeScene?.glb && !activeScene.glb.includes('PLACEHOLDER'))
  const hasPiscine = config.garden.includes('piscine')
  const hasLavande = config.garden.includes('lavande')

  useEffect(() => {
    const nextKey = `house:${config.house}`
    if (!sceneKey.startsWith('site-context') && sceneKey !== nextKey) {
      setSceneKey(nextKey)
    }
  }, [config.house, sceneKey])

  const activate = async () => {
    setLoading(true)
    try {
      if (glbReady) {
        await ensureModelViewerLoaded()
      }
      setActive(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      {!active && !loading && (
        <div className={styles.activate} onClick={activate}>
          <div className={styles.activateIcon}>
            <CubeIcon />
          </div>
          <h3 className={styles.activateTitle}>Visualisation 3D interactive</h3>
          <p className={styles.activateDesc}>
            Le viewer charge maintenant le volume maison, la version implantee sur parcelle
            et le contexte global du terrain quand ces exports Blender existent.
          </p>
          <button className={styles.activateBtn}>Activer la vue 3D</button>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Chargement du modele...</p>
        </div>
      )}

      {active && glbReady && (
        <model-viewer
          key={activeScene.key}
          src={activeScene.glb}
          alt={activeScene.alt}
          camera-controls
          auto-rotate
          auto-rotate-delay="2000"
          rotation-per-second="20deg"
          shadow-intensity="1"
          exposure="0.8"
          environment-image="neutral"
          loading="lazy"
          reveal="auto"
          style={{ width: '100%', height: '360px', background: 'var(--night)' }}
        />
      )}

      {active && !glbReady && (
        <SceneFallback
          houseOpt={activeScene.houseOpt ?? houseOpt}
          roofOpt={roofOpt}
          hasPiscine={hasPiscine}
          hasLavande={hasLavande}
        />
      )}

      {active && (
        <div className={styles.controls}>
          <div className={styles.glbSelector}>
            {sceneOptions.map((scene) => (
              <button
                key={scene.key}
                className={`${styles.glbBtn} ${sceneKey === scene.key ? styles.glbBtnActive : ''}`}
                onClick={() => setSceneKey(scene.key)}
              >
                {scene.label}
              </button>
            ))}
          </div>
          <span className={styles.hint}>
            {activeScene.desc ? `${activeScene.desc} · ` : ''}Glissez pour tourner · Pincez pour zoomer
          </span>
        </div>
      )}
    </div>
  )
}

function buildSceneOptions(houseOpt) {
  const scenes = [
    {
      key: `house:${houseOpt.key}`,
      label: houseOpt.label,
      desc: 'Modele maison seul',
      glb: houseOpt.glb,
      alt: `Modele 3D ${houseOpt.label}`,
      houseOpt,
    },
  ]

  if (houseOpt.parcelGlb) {
    scenes.push({
      key: `parcel:${houseOpt.key}`,
      label: houseOpt.parcelLabel || 'Parcelle',
      desc: 'Maison replacee sur la parcelle',
      glb: houseOpt.parcelGlb,
      alt: `Projection parcelle ${houseOpt.label}`,
      houseOpt,
    })
  }

  SITE_SCENES.forEach((scene) => {
    scenes.push({
      key: scene.key,
      label: scene.label,
      desc: scene.desc,
      glb: scene.glb,
      alt: scene.label,
      houseOpt,
    })
  })

  return scenes
}

function SceneFallback({ houseOpt, roofOpt, hasPiscine, hasLavande }) {
  return (
    <svg
      viewBox="0 0 500 320"
      style={{ width: '100%', height: 320, background: 'var(--night)', display: 'block' }}
      aria-label="Visualisation illustree du terrain"
    >
      <defs>
        <linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A9260" />
          <stop offset="100%" stopColor="#3A5828" />
        </linearGradient>
      </defs>
      <rect width="500" height="210" fill="#1E2C3A" />
      <rect y="210" width="500" height="110" fill="url(#sg2)" />
      <ellipse cx="100" cy="215" rx="130" ry="18" fill="#4A6838" opacity="0.6" />
      <ellipse cx="400" cy="212" rx="140" ry="20" fill="#3A5828" opacity="0.6" />
      {[40, 90, 150, 200, 280, 340, 420, 460].map((x, i) => (
        <circle key={i} cx={x} cy={[20, 45, 15, 60, 30, 50, 25, 40][i]} r="1" fill="rgba(255,255,255,0.5)" />
      ))}
      <rect x="165" y="130" width="170" height="90" fill={houseOpt.bodyColor || '#E8DDD0'} stroke="#C8B89A" strokeWidth="1.5" />
      <polygon points={roofOpt.svgPoints || '150,130 250,65 350,130'} fill={roofOpt.svgColor || '#8A5C3A'} />
      <rect x="300" y="82" width="16" height="38" fill="#7A5030" />
      <rect x="228" y="178" width="42" height="42" rx="2" fill="#4A2A0A" />
      <circle cx="263" cy="200" r="4" fill="#C9A84C" />
      <rect x="177" y="145" width="38" height="28" rx="2" fill="#A8C4D8" stroke="#7A9AB0" strokeWidth="1" />
      <line x1="196" y1="145" x2="196" y2="173" stroke="#7A9AB0" strokeWidth="0.8" />
      <line x1="177" y1="159" x2="215" y2="159" stroke="#7A9AB0" strokeWidth="0.8" />
      <rect x="285" y="145" width="38" height="28" rx="2" fill="#A8C4D8" stroke="#7A9AB0" strokeWidth="1" />
      <line x1="304" y1="145" x2="304" y2="173" stroke="#7A9AB0" strokeWidth="0.8" />
      <line x1="285" y1="159" x2="323" y2="159" stroke="#7A9AB0" strokeWidth="0.8" />
      {[170, 211, 279, 321].map((x, i) => (
        <rect key={i} x={x} y="145" width="10" height="28" fill="#5C7A5C" rx="1" />
      ))}
      <rect x="88" y="175" width="7" height="45" fill="#3A2010" />
      <ellipse cx="91" cy="162" rx="22" ry="28" fill="#2A4820" />
      <rect x="390" y="178" width="6" height="42" fill="#3A2010" />
      <ellipse cx="393" cy="165" rx="18" ry="24" fill="#2A4820" />
      <rect x="140" y="182" width="5" height="38" fill="#2A1808" />
      <ellipse cx="142" cy="162" rx="10" ry="38" fill="#1A3818" />
      {hasPiscine && (
        <g>
          <rect x="58" y="210" width="65" height="35" rx="7" fill="#4A9ABC" stroke="#2A7A9C" strokeWidth="1.5" />
          <rect x="64" y="216" width="53" height="23" rx="5" fill="#5AAAD0" opacity="0.6" />
        </g>
      )}
      {hasLavande && [350, 362, 374, 386, 398].map((x, i) => (
        <g key={i} opacity="0.9">
          <rect x={x + 1} y="207" width="3" height="11" fill="#6A7A40" />
          <ellipse
            cx={x + 2.5}
            cy="203"
            rx="4"
            ry="6"
            fill={['#8A6AAA', '#7A5A9A', '#9A7ABA', '#8A6AAA', '#7A5A9A'][i]}
          />
        </g>
      ))}
      <text
        x="250"
        y="310"
        textAnchor="middle"
        fill="rgba(247,244,238,0.2)"
        fontSize="9"
        fontFamily="monospace"
        letterSpacing="0.1em"
      >
        MODELE SVG · REMPLACER PAR GLB BLENDER
      </text>
    </svg>
  )
}

function CubeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(247,244,238,0.7)" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
