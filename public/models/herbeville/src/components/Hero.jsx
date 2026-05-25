import { useEffect, useMemo, useRef } from 'react'
import { PROPERTY } from '../config/property.js'
import s from './Hero.module.css'

export default function Hero() {
  const hasVideo = Boolean(PROPERTY.heroVideo?.src)
  const fallbackSlide = useMemo(() => PROPERTY.heroSlides[0], [])
  const videoRef = useRef(null)
  const restartTimerRef = useRef(null)

  useEffect(
    () => () => {
      if (restartTimerRef.current) {
        window.clearTimeout(restartTimerRef.current)
      }
    },
    [],
  )

  const handleVideoEnded = () => {
    if (restartTimerRef.current) {
      window.clearTimeout(restartTimerRef.current)
    }

    restartTimerRef.current = window.setTimeout(() => {
      const video = videoRef.current
      if (!video) return
      video.currentTime = 0
      video.play().catch(() => {})
    }, 5000)
  }

  return (
    <section className={s.hero}>
      <div className={s.slides}>
        {hasVideo ? (
          <div className={`${s.slide} ${s.slideActive}`}>
            <video
              ref={videoRef}
              className={s.heroVideo}
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={PROPERTY.heroVideo.poster}
              onEnded={handleVideoEnded}
            >
              <source src={PROPERTY.heroVideo.src} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div className={`${s.slide} ${s.slideActive}`}>
            <img src={fallbackSlide.src} alt={fallbackSlide.label} className={s.slideImg} />
          </div>
        )}
        <div className={s.gradient} />
      </div>

      <div className={s.slideInfo}>
        <span className={s.slideLabel}>{hasVideo ? PROPERTY.heroVideo.label : fallbackSlide.label}</span>
      </div>

      <div className={s.content}>
        <p className={`t-label anim-fade-up ${s.label}`}>Terrain constructible - Herbeville - Yvelines</p>

        <h1 className={`t-display anim-fade-up anim-delay-1 ${s.title}`}>
          6 Route de
          <br />
          <em>Maule</em>
        </h1>

        <p className={`t-body anim-fade-up anim-delay-2 ${s.sub}`}>
          Deux parcelles constructibles au coeur du Vexin francais.
          <br />A moins d&apos;une heure de Paris, dans un village preserve avec vues ouvertes sur la campagne.
        </p>

        <div className={`anim-fade-up anim-delay-3 ${s.ctas}`}>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('configurateur')?.scrollIntoView({ behavior: 'smooth' })}
            type="button"
          >
            Composer mon projet
          </button>
          <a className="btn btn-ghost" href={PROPERTY.googleEarthUrl} target="_blank" rel="noopener noreferrer">
            <GlobeIcon /> Ouvrir dans Google Earth
          </a>
        </div>

        <div className={`anim-fade-up anim-delay-4 ${s.stats}`}>
          <Stat num="~1 900" unit="m²" label="Surface totale" />
          <div className={s.statDivider} />
          <Stat num="~58" unit="km" label="Depuis Paris" />
          <div className={s.statDivider} />
          <Stat num="2" unit="lots" label="A developper" />
        </div>
      </div>

      <div className={s.gpsBadge}>
        <code>
          {PROPERTY.lat.toFixed(5)} N - {PROPERTY.lng.toFixed(5)} E
        </code>
      </div>

      <div className={s.scrollHint}>
        <div className={s.scrollLine} />
      </div>
    </section>
  )
}

function Stat({ num, unit, label }) {
  return (
    <div className={s.stat}>
      <span className={s.statNum}>
        {num}
        <span className={s.statUnit}>{unit}</span>
      </span>
      <span className={s.statLabel}>{label}</span>
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      <path d="M2 12h20" />
    </svg>
  )
}
