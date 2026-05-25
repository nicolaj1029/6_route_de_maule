import { useEffect, useState } from 'react'
import { PROPERTY } from '../config/property.js'
import s from './Hero.module.css'

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const [loaded, setLoaded] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((current) => (current + 1) % PROPERTY.heroSlides.length)
    }, 6000)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className={s.hero}>
      <div className={s.slides}>
        {PROPERTY.heroSlides.map((slide, index) => (
          <div key={slide.label} className={`${s.slide} ${index === idx ? s.slideActive : ''}`}>
            <img
              src={slide.src}
              alt={slide.label}
              className={s.slideImg}
              onLoad={() => setLoaded((prev) => ({ ...prev, [index]: true }))}
            />
            {!loaded[index] && <div className={s.slidePlaceholder} style={{ '--n': index }} />}
          </div>
        ))}
        <div className={s.gradient} />
      </div>

      <div className={s.slideInfo}>
        <span className={s.slideLabel}>{PROPERTY.heroSlides[idx].label}</span>
        <div className={s.dots}>
          {PROPERTY.heroSlides.map((slide, index) => (
            <button
              key={slide.label}
              className={`${s.dot} ${index === idx ? s.dotActive : ''}`}
              onClick={() => setIdx(index)}
              aria-label={`Afficher ${slide.label}`}
              type="button"
            />
          ))}
        </div>
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
          <br />
          A moins d&apos;une heure de Paris, dans un village preserve avec vues ouvertes sur la campagne.
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
        <code>{PROPERTY.lat.toFixed(5)} N - {PROPERTY.lng.toFixed(5)} E</code>
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
