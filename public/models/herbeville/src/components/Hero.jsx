import { useEffect, useState } from 'react'
import { PROPERTY } from '../config/property.js'
import HeroLandscape from './HeroLandscape.jsx'
import styles from './Hero.module.css'

export default function Hero() {
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [photoError, setPhotoError] = useState({})
  const photos = PROPERTY.photos

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhoto((current) => (current + 1) % photos.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [photos.length])

  const scrollToConfig = () =>
    document.getElementById('config-sec')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className={styles.hero}>
      <div className={styles.visual}>
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            className={styles.photoSlide}
            style={{ opacity: index === currentPhoto ? 1 : 0 }}
          >
            {photoError[index] ? (
              <HeroLandscape />
            ) : (
              <img
                src={photo.src}
                alt={photo.alt}
                className={styles.photoImg}
                onError={() => setPhotoError((previous) => ({ ...previous, [index]: true }))}
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            )}
          </div>
        ))}

        <div className={styles.overlay} />

        <span className={styles.badgeTL}>Terrain constructible | Yvelines</span>
        <span className={styles.badgeTR}>
          {PROPERTY.lat.toFixed(4)} N | {PROPERTY.lng.toFixed(4)} E
        </span>

        <div className={styles.dots}>
          {photos.map((photo, index) => (
            <button
              key={photo.alt}
              className={`${styles.dot} ${index === currentPhoto ? styles.dotActive : ''}`}
              onClick={() => setCurrentPhoto(index)}
              aria-label={`Photo ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.content}>
        <span className="section-label">A vendre | Ile-de-France</span>
        <h1 className={styles.title}>
          6 Route Maule
          <br />
          <em>Herbeville</em>
        </h1>
        <p className={styles.sub}>
          Une parcelle pour montrer non seulement ou se trouve le terrain, mais surtout ce qu&apos;il peut devenir.
          Maison familiale, refuge de week-end ou projet d&apos;architecture contemporaine: la page sert de support
          de vente, de projection et de discussion.
        </p>

        <div className={styles.pills}>
          {PROPERTY.heroHighlights.map((item) => (
            <span key={item} className={styles.pill}>{item}</span>
          ))}
        </div>

        <div className={styles.ctas}>
          <button className="btn-primary" onClick={scrollToConfig}>
            Voir les possibilites
          </button>
          <a
            className="btn-outline"
            href={PROPERTY.googleEarthUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GlobeIcon />
            Ouvrir Google Earth
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNum}>~{PROPERTY.surfaceM2} m2</span>
            <span className={styles.statLbl}>Surface estimee</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{PROPERTY.distanceParis} km</span>
            <span className={styles.statLbl}>Depuis Paris</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNum}>{PROPERTY.permit}</span>
            <span className={styles.statLbl}>Base urbanistique</span>
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <div className={styles.scrollLine} />
        <span>Decouvrir</span>
      </div>
    </section>
  )
}

function GlobeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}
