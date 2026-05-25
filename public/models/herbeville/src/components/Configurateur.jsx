import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { assetPath } from '../config/assets.js'
import s from './Configurateur.module.css'

const ThreeSceneViewer = lazy(() => import('./ThreeSceneViewer.jsx'))

const HOUSE_STYLES = [
  {
    key: 'normande',
    label: 'Maison normande',
    desc: 'Colombages, volets, allure vernaculaire',
    glb: assetPath('models/maison-normande.glb'),
    render: assetPath('images/terrain-01.png'),
    parcel: { width: 42, depth: 30, houseWidth: 13.5, houseDepth: 9.5, houseX: 19, houseZ: 16, rotation: 0.08 },
  },
  {
    key: 'villa',
    label: 'Villa contemporaine',
    desc: 'Toit plat, verre, zinc, vie dedans-dehors',
    glb: assetPath('models/villa-moderne.glb'),
    render: assetPath('images/terrain-02.png'),
    parcel: { width: 48, depth: 16, houseWidth: 16, houseDepth: 9, houseX: 19, houseZ: 8, rotation: 0 },
  },
  {
    key: 'bois',
    label: 'Chalet bois',
    desc: 'Ossature bois, zinc, veranda',
    glb: assetPath('models/chalet-bois.glb'),
    render: assetPath('images/terrain-01.png'),
    parcel: { width: 42, depth: 30, houseWidth: 12, houseDepth: 8, houseX: 18, houseZ: 15, rotation: -0.05 },
  },
  {
    key: 'bungalow',
    label: 'Bungalow',
    desc: 'Plain-pied, pergola, terrasse',
    glb: assetPath('models/bungalow.glb'),
    render: assetPath('images/terrain-02.png'),
    parcel: { width: 42, depth: 30, houseWidth: 15, houseDepth: 8.5, houseX: 20, houseZ: 15, rotation: 0 },
  },
]

const GARDEN_ELEMENTS = [
  { key: 'lavande', emoji: 'Lavande', label: 'Lavande', color: '#7B5EA7' },
  { key: 'olivier', emoji: 'Olivier', label: 'Olivier', color: '#5C7A3C' },
  { key: 'cypres', emoji: 'Cypres', label: 'Cypres', color: '#2E4A2E' },
  { key: 'piscine', emoji: 'Piscine', label: 'Piscine', color: '#2E7FA8' },
  { key: 'terrasse', emoji: 'Terrasse', label: 'Terrasse bois', color: '#8B5E30' },
  { key: 'pergola', emoji: 'Pergola', label: 'Pergola', color: '#A0784C' },
  { key: 'haie', emoji: 'Haie', label: 'Haie bocagere', color: '#2A5A2A' },
  { key: 'bassin', emoji: 'Bassin', label: 'Bassin', color: '#4A8A9C' },
]

const PRESETS = {
  normande: ['lavande', 'cypres', 'bassin', 'haie'],
  villa: ['piscine', 'terrasse', 'lavande', 'olivier'],
  bois: ['haie', 'pergola', 'lavande', 'olivier'],
  bungalow: ['terrasse', 'pergola', 'haie', 'piscine'],
}

const DROP_POINTS = [
  { x: 28, y: 58 },
  { x: 64, y: 58 },
  { x: 36, y: 74 },
  { x: 60, y: 76 },
  { x: 22, y: 38 },
  { x: 74, y: 34 },
]

function makePlacedElement(key, index = 0) {
  const element = GARDEN_ELEMENTS.find((item) => item.key === key)
  const point = DROP_POINTS[index % DROP_POINTS.length]
  if (!element) return null

  return {
    ...element,
    id: `${key}_${Date.now()}_${index}`,
    x: point.x,
    y: point.y,
  }
}

function makePresetElements(houseKey) {
  return (PRESETS[houseKey] ?? []).map((presetKey, index) => makePlacedElement(presetKey, index)).filter(Boolean)
}

export default function Configurateur({ config, setConfig }) {
  const [viewerActive, setViewerActive] = useState(false)
  const [placedElements, setPlacedElements] = useState(() => makePresetElements(config.house))
  const [dragEl, setDragEl] = useState(null)
  const groundRef = useRef(null)

  const house = HOUSE_STYLES.find((item) => item.key === config.house) || HOUSE_STYLES[0]
  const uniqueLabels = useMemo(() => [...new Set(placedElements.map((item) => item.label))], [placedElements])

  useEffect(() => {
    const nextPlaced = makePresetElements(config.house)
    setPlacedElements(nextPlaced)
  }, [config.house])

  const selectHouse = (key) => {
    const nextPlaced = makePresetElements(key)
    setConfig((current) => ({ ...current, house: key, garden: nextPlaced.map((item) => item.key) }))
    setPlacedElements(nextPlaced)
    setViewerActive(false)
  }

  const addElement = (key, pointIndex = placedElements.length) => {
    const next = makePlacedElement(key, pointIndex)
    if (!next) return
    setPlacedElements((current) => {
      const updated = [...current, next]
      setConfig((cfg) => ({ ...cfg, garden: updated.map((item) => item.key) }))
      return updated
    })
  }

  const removeElement = (id) => {
    setPlacedElements((current) => {
      const updated = current.filter((item) => item.id !== id)
      setConfig((cfg) => ({ ...cfg, garden: updated.map((item) => item.key) }))
      return updated
    })
  }

  const handleGroundDrop = (event) => {
    event.preventDefault()
    if (!dragEl) return

    const rect = groundRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    const element = GARDEN_ELEMENTS.find((item) => item.key === dragEl)

    if (element) {
      setPlacedElements((current) => {
        const updated = [...current, { ...element, id: `${dragEl}_${Date.now()}`, x, y }]
        setConfig((cfg) => ({ ...cfg, garden: updated.map((item) => item.key) }))
        return updated
      })
    }

    setDragEl(null)
  }

  return (
    <section className={s.section} id="configurateur">
      <div className={s.inner}>
        <div className={s.controls}>
          <div className={s.controlsHeader}>
            <p className="t-label">Configurateur</p>
            <h2 className={s.heading}>
              Composer une implantation,
              <br />
              puis ouvrir la scene 3D
            </h2>
          </div>

          <div className={s.block}>
            <p className={s.blockLabel}>Style de maison</p>
            <div className={s.houseGrid}>
              {HOUSE_STYLES.map((item) => (
                <button
                  key={item.key}
                  className={`${s.houseBtn} ${config.house === item.key ? s.houseBtnActive : ''}`}
                  onClick={() => selectHouse(item.key)}
                  type="button"
                >
                  <span className={s.houseName}>{item.label}</span>
                  <span className={s.houseDesc}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={s.block}>
            <p className={s.blockLabel}>Elements de jardin</p>
            <p className={s.blockHint}>Glissez sur le plan, ou touchez pour ajouter.</p>
            <div className={s.gardenPalette}>
              {GARDEN_ELEMENTS.map((item) => (
                <button
                  key={item.key}
                  className={s.gardenEl}
                  draggable
                  onDragStart={() => setDragEl(item.key)}
                  onDragEnd={() => setDragEl(null)}
                  onClick={() => addElement(item.key)}
                  style={{ '--el-color': item.color }}
                  type="button"
                >
                  <span className={s.gardenEmoji}>{item.emoji}</span>
                  <span className={s.gardenLabel}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button className={s.btn3d} onClick={() => setViewerActive((value) => !value)} type="button">
            {viewerActive ? 'Fermer la vue 3D' : 'Ouvrir la vue 3D'}
          </button>
          <p className={s.viewerNote}>
            La vue 3D repose sur une parcelle calibree en metres. Les ajouts jardin du plan 2D y sont
            reconstitues comme objets 3D legers dans cette version.
          </p>
        </div>

        <div className={s.preview}>
          {viewerActive ? (
            <Suspense fallback={<div className={s.sceneLoading}>Chargement de la scene 3D...</div>}>
              <ThreeSceneViewer
                house={house}
                placedElements={placedElements}
                onClose={() => setViewerActive(false)}
              />
            </Suspense>
          ) : (
            <div
              ref={groundRef}
              className={s.ground}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleGroundDrop}
            >
              <svg className={s.groundSvg} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {config.house === 'villa' ? (
                  <polygon points="2,30 98,22 98,78 2,70" fill="#E8E4DA" stroke="#C4A882" strokeWidth="0.5" />
                ) : (
                  <polygon
                    points="5,5 72,2 95,15 90,78 55,95 8,88 3,50"
                    fill="#E8E4DA"
                    stroke="#C4A882"
                    strokeWidth="0.5"
                  />
                )}

                {config.house === 'villa' ? (
                  <rect x="12" y="35" width="38" height="30" fill="#D4C8B8" stroke="#9A7A5A" strokeWidth="0.5" rx="0.5" />
                ) : (
                  <rect x="22" y="28" width="34" height="28" fill="#D4C8B8" stroke="#9A7A5A" strokeWidth="0.5" rx="0.5" />
                )}

                <text x="92" y="8" fontSize="4" fill="#A8A090" textAnchor="middle" fontFamily="serif">
                  N
                </text>
                <line x1="92" y1="9" x2="92" y2="14" stroke="#A8A090" strokeWidth="0.5" />
                <line x1="5" y1="97" x2="25" y2="97" stroke="#A8A090" strokeWidth="0.5" />
                <text x="15" y="100" fontSize="3" fill="#A8A090" textAnchor="middle">
                  10m
                </text>
              </svg>

              {placedElements.map((element) => (
                <button
                  key={element.id}
                  className={s.placed}
                  style={{ left: `${element.x}%`, top: `${element.y}%`, '--el-color': element.color }}
                  onClick={() => removeElement(element.id)}
                  title={`${element.label} - cliquez pour retirer`}
                  type="button"
                >
                  <span>{element.emoji}</span>
                  <span className={s.placedLabel}>{element.label}</span>
                </button>
              ))}

              {placedElements.length === 0 && <p className={s.dropHint}>Ajoutez des elements au plan</p>}
            </div>
          )}

          <div className={s.summary}>
            <span className={s.summaryItem}>
              <strong>{house.label}</strong>
            </span>
            {uniqueLabels.length > 0 && <span className={s.summaryGarden}>+ {uniqueLabels.join(', ')}</span>}
            <button
              className={s.summaryClear}
              onClick={() => {
                setPlacedElements([])
                setConfig((cfg) => ({ ...cfg, garden: [] }))
              }}
              type="button"
            >
              Reinitialiser
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
