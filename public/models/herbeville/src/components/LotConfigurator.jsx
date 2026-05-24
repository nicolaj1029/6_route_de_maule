import { useState } from 'react'
import { GARDEN_ELEMENTS, MOOD_OPTIONS } from '../config/gardenOptions.js'
import { HOUSE_STYLES, ROOF_STYLES } from '../config/houseOptions.js'
import GardenSelector from './GardenSelector.jsx'
import HouseStyleSelector from './HouseStyleSelector.jsx'
import ModelViewer from './ModelViewer.jsx'
import styles from './LotConfigurator.module.css'

const TABS = ['Maison', 'Toiture', 'Jardin', 'Ambiance']

export default function LotConfigurator({ config, setConfig }) {
  const [activeTab, setActiveTab] = useState(0)

  const selectedHouse = HOUSE_STYLES.find((item) => item.key === config.house)
  const selectedRoof = ROOF_STYLES.find((item) => item.key === config.roof)
  const selectedMood = MOOD_OPTIONS.find((item) => item.key === config.mood)

  const setHouse = (key) => setConfig((current) => ({ ...current, house: key }))
  const setRoof = (key) => setConfig((current) => ({ ...current, roof: key }))
  const setMood = (key) => setConfig((current) => ({ ...current, mood: key }))
  const toggleGarden = (key) => setConfig((current) => {
    const already = current.garden.includes(key)
    return {
      ...current,
      garden: already ? current.garden.filter((item) => item !== key) : [...current.garden, key],
    }
  })

  return (
    <section className={styles.section} id="config-sec">
      <span className="section-label">Projection de projet</span>
      <h2 className="section-title">Imaginez ce que la parcelle peut devenir</h2>
      <p className="section-body" style={{ marginBottom: 0 }}>
        La logique reste simple: vous choisissez une direction de projet, et la page ajuste
        l&apos;apercu, le jardin et la future vue 3D autour de cette intention.
      </p>

      <div className={styles.tabs}>
        {TABS.map((tab, index) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === index ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && (
        <HouseStyleSelector options={HOUSE_STYLES} selected={config.house} onSelect={setHouse} />
      )}
      {activeTab === 1 && (
        <HouseStyleSelector options={ROOF_STYLES} selected={config.roof} onSelect={setRoof} />
      )}
      {activeTab === 2 && (
        <GardenSelector options={GARDEN_ELEMENTS} selected={config.garden} onToggle={toggleGarden} />
      )}
      {activeTab === 3 && (
        <HouseStyleSelector options={MOOD_OPTIONS} selected={config.mood} onSelect={setMood} />
      )}

      <div className={styles.summary}>
        <span className={styles.summaryItem}>Maison: {selectedHouse?.label}</span>
        <span className={styles.summaryItem}>Toiture: {selectedRoof?.label}</span>
        <span className={styles.summaryItem}>Ambiance: {selectedMood?.label}</span>
        <span className={styles.summaryItem}>Jardin: {config.garden.length} choix</span>
      </div>

      <ModelViewer config={config} />

      <div className={styles.infoBox}>
        <InfoIcon />
        <p>
          La vue 3D reste volontairement sobre pour la premiere version. Tant que les fichiers GLB
          ne sont pas ajoutes, la page garde un fallback illustratif pour rester rapide sur mobile.
        </p>
      </div>
    </section>
  )
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}
