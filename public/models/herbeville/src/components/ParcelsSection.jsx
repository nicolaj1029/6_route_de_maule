import { PROPERTY } from '../config/property.js'
import s from './ParcelsSection.module.css'

export default function ParcelsSection({ setConfig }) {
  return (
    <section className={`section section--parchment ${s.section}`} id="parcelles">
      <div className="container">
        <div className={s.header}>
          <p className="t-label">Les deux parcelles</p>
          <h2 className="t-heading">
            Deux scenarios de vie,
            <br />
            une meme adresse
          </h2>
        </div>

        <div className={s.grid}>
          {PROPERTY.parcels.map((parcel) => (
            <ParcelCard key={parcel.id} parcel={parcel} setConfig={setConfig} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ParcelCard({ parcel, setConfig }) {
  return (
    <article className={s.card}>
      <div className={s.cardVisual}>
        <div className={s.cardImg} style={{ backgroundImage: `url(${parcel.render})` }} />
        <div className={s.cardOverlay} />
        <span className={s.cardId}>{parcel.label}</span>
        <span className={s.cardSurface}>{parcel.surface}</span>
      </div>

      <div className={s.cardBody}>
        <div className={s.cardMeta}>
          <span className={s.cardDims}>{parcel.dims}</span>
        </div>
        <h3 className={s.cardName}>{parcel.name}</h3>
        <p className={s.cardStyle}>{parcel.style}</p>

        <div className={s.cardTags}>
          {parcel.tags.map((tag) => (
            <span key={tag} className={s.tag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={s.cardActions}>
          <button
            className={s.viewBtn}
            onClick={() => {
              setConfig((current) => ({ ...current, house: parcel.houseKey, parcelId: parcel.id }))
              document.getElementById('configurateur')?.scrollIntoView({ behavior: 'smooth' })
            }}
            type="button"
          >
            Configurer la parcelle {parcel.id}
          </button>
        </div>
      </div>
    </article>
  )
}
