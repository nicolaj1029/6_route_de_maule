import { PROPERTY } from '../config/property.js'
import s from './AccessSection.module.css'

const DISTANCES = [
  { label: 'Paris St-Lazare', mode: 'Train', time: '45 min', detail: 'Mantes-la-Jolie gare' },
  { label: 'Mantes-la-Jolie', mode: 'Voiture', time: '12 min', detail: '11 km' },
  { label: 'Versailles', mode: 'Voiture', time: '38 min', detail: '42 km' },
  { label: 'CDG aeroport', mode: 'Voiture', time: '55 min', detail: '68 km' },
]

const PROXIMITY = [
  { icon: 'Ecole', label: 'Ecole primaire', dist: 'Herbeville - 0.3 km' },
  { icon: 'Marche', label: 'Supermarche', dist: 'Mantes - 11 km' },
  { icon: 'Sante', label: 'Hopital', dist: 'Mantes - 13 km' },
  { icon: 'Nature', label: 'Parc du Vexin', dist: 'Limite - 0.5 km' },
]

export default function AccessSection() {
  return (
    <section className={`section section--dark ${s.section}`} id="acces">
      <div className="container">
        <div className={s.topRow}>
          <div>
            <p className="t-label" style={{ color: 'var(--gold)' }}>
              Localisation
            </p>
            <h2 className="t-heading" style={{ color: 'white', marginTop: '0.5rem' }}>
              Herbeville,
              <br />
              Yvelines
            </h2>
          </div>
          <div className={s.coords}>
            <p className={s.coordLine}>48.9078 N</p>
            <p className={s.coordLine}>1.8788 E</p>
            <div className={s.mapLinks}>
              <a className={s.mapLink} href={PROPERTY.googleEarthUrl} target="_blank" rel="noopener noreferrer">
                Google Earth -&gt;
              </a>
              <a className={s.mapLink} href={PROPERTY.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                Google Maps -&gt;
              </a>
            </div>
          </div>
        </div>

        <div className={s.distances}>
          {DISTANCES.map((distance) => (
            <div key={distance.label} className={s.distItem}>
              <span className={s.distTime}>{distance.time}</span>
              <span className={s.distLabel}>{distance.label}</span>
              <span className={s.distDetail}>
                {distance.mode} - {distance.detail}
              </span>
            </div>
          ))}
        </div>

        <div className={s.proximity}>
          {PROXIMITY.map((item) => (
            <div key={item.label} className={s.proxItem}>
              <span className={s.proxIcon}>{item.icon}</span>
              <div>
                <p className={s.proxLabel}>{item.label}</p>
                <p className={s.proxDist}>{item.dist}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
