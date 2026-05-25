import { useEffect, useState } from 'react'
import s from './ModelViewer.module.css'

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

export default function ModelViewer({ glb, label, onClose }) {
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const hasGlb = Boolean(glb)

  useEffect(() => {
    let cancelled = false

    async function loadViewer() {
      if (!hasGlb) {
        setLoading(false)
        return
      }

      try {
        await ensureModelViewerLoaded()
        if (!cancelled) {
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setFailed(true)
          setLoading(false)
        }
      }
    }

    setLoading(true)
    setFailed(false)
    loadViewer()

    return () => {
      cancelled = true
    }
  }, [glb, hasGlb])

  return (
    <div className={s.wrap}>
      {loading && (
        <div className={s.loadingOverlay}>
          <div className={s.spinner} />
          <p>Chargement de la scene 3D...</p>
        </div>
      )}

      {hasGlb && !failed ? (
        <model-viewer
          src={glb}
          alt={`Scene 3D - ${label}`}
          camera-controls
          auto-rotate
          auto-rotate-delay="1500"
          rotation-per-second="18deg"
          shadow-intensity="1.2"
          exposure="0.9"
          environment-image="neutral"
          loading="lazy"
          reveal="auto"
          style={{ width: '100%', height: '460px', background: '#18181A' }}
        />
      ) : (
        <div className={s.fallback}>
          <div className={s.fallbackScene} />
          <p className={s.fallbackLabel}>
            Placez <code>{glb}</code>
            <br />
            dans <code>public/models/</code> pour activer la vue 3D
          </p>
        </div>
      )}

      <div className={s.bar}>
        <span className={s.barLabel}>{label}</span>
        <span className={s.barHint}>Glissez - Pincez - Rotation</span>
        <button className={s.closeBtn} onClick={onClose} type="button">
          Retour au plan 2D
        </button>
      </div>
    </div>
  )
}
