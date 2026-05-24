import { useState } from 'react'
import { PROPERTY } from '../config/property.js'
import styles from './MapSection.module.css'

export default function MapSection() {
  const [copied, setCopied] = useState(false)

  const openMaps = () => window.open(PROPERTY.googleMapsUrl, '_blank', 'noopener,noreferrer')
  const openMapsOnKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMaps()
    }
  }

  const copyCoordinates = async () => {
    const value = `${PROPERTY.lat}, ${PROPERTY.lng}`
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section className={styles.section} id="map-sec">
      <span className="section-label" style={{ color: 'var(--gold)' }}>Localisation</span>
      <h2 className={styles.title}>Voir le terrain dans son contexte reel</h2>
      <p className={styles.body}>
        La premiere version reste simple: un acces direct vers Google Earth, Google Maps et Geoportail,
        avec les coordonnees du terrain centralisees dans la configuration pour une evolution 3D plus tard.
      </p>

      <div className={styles.highlightRow}>
        {PROPERTY.mapHighlights.map((item) => (
          <span key={item} className={styles.highlight}>{item}</span>
        ))}
      </div>

      <div className={styles.mapContainer}>
        <div id="cesiumSlot" style={{ width: '100%', height: '100%', display: 'none' }} />

        <div
          className={styles.mapFallback}
          onClick={openMaps}
          onKeyDown={openMapsOnKey}
          id="mapFallback"
          role="button"
          tabIndex={0}
        >
          <div className={styles.mapGrid} />
          <div className={styles.mapPin}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ marginBottom: '0.7rem' }}>
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <p className={styles.mapHint}>Cliquez pour ouvrir la localisation dans Google Maps</p>
            <code className={styles.coords}>
              {PROPERTY.lat} | {PROPERTY.lng}
            </code>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <a className={styles.btnGold} href={PROPERTY.googleEarthUrl} target="_blank" rel="noopener noreferrer">
          <GlobeIcon /> Google Earth
        </a>
        <a className={styles.btnGhost} href={PROPERTY.googleMapsUrl} target="_blank" rel="noopener noreferrer">
          Google Maps
        </a>
        <a className={styles.btnGhost} href={PROPERTY.geoportailUrl} target="_blank" rel="noopener noreferrer">
          Geoportail
        </a>
        <button className={styles.btnGhostButton} onClick={copyCoordinates} type="button">
          {copied ? 'Coordonnees copiees' : 'Copier les coordonnees'}
        </button>
      </div>

      <div className={styles.infoCard}>
        <div>
          <strong>Google Earth est deja branche via une URL simple.</strong>
          <p>
            Aucun SDK n&apos;est necessaire pour cette premiere version: le bouton ouvre la vue web de Google Earth
            centree sur le terrain. Plus tard, on pourra garder ce fallback et ajouter une scene Cesium a cote.
          </p>
        </div>
      </div>
    </section>
  )
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
    </svg>
  )
}
