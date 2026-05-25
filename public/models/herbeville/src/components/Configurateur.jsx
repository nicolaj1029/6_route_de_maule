import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { assetPath } from '../config/assets.js'
import s from './Configurateur.module.css'

const ThreeSceneViewer = lazy(() => import('./ThreeSceneViewer.jsx'))

const HOUSE_STYLES = [
  {
    key: 'normande',
    label: 'Maison normande',
    desc: 'Colombages, volets, allure vernaculaire',
    parcelId: 'A',
    glb: assetPath('models/maison-normande.glb'),
    parcel: { width: 42, depth: 30, houseWidth: 13.5, houseDepth: 9.5, planWidth: 16.5, planDepth: 12, houseX: 19, houseZ: 16, rotation: 0.08 },
  },
  {
    key: 'villa',
    label: 'Villa contemporaine',
    desc: 'Toit plat, verre, zinc, vie dedans-dehors',
    parcelId: 'B',
    glb: assetPath('models/villa-moderne.glb'),
    parcel: { width: 48, depth: 16, houseWidth: 16, houseDepth: 9, planWidth: 20, planDepth: 11.5, houseX: 19, houseZ: 8, rotation: 0 },
  },
  {
    key: 'bois',
    label: 'Chalet bois',
    desc: 'Ossature bois, zinc, veranda',
    parcelId: 'A',
    glb: assetPath('models/chalet-bois.glb'),
    parcel: { width: 42, depth: 30, houseWidth: 12, houseDepth: 8, planWidth: 15.5, planDepth: 10, houseX: 18, houseZ: 15, rotation: -0.05 },
  },
  {
    key: 'bungalow',
    label: 'Bungalow',
    desc: 'Plain-pied, pergola, terrasse',
    parcelId: 'A',
    glb: assetPath('models/bungalow.glb'),
    parcel: { width: 42, depth: 30, houseWidth: 15, houseDepth: 8.5, planWidth: 22, planDepth: 12, houseX: 20, houseZ: 15, rotation: 0 },
  },
]

const GARDEN_ELEMENTS = [
  { key: 'lavande', emoji: 'Lavande', label: 'Lavande', color: '#7B5EA7', width: 4.2, depth: 2.2, shape: 'patch' },
  { key: 'olivier', emoji: 'Olivier', label: 'Olivier', color: '#5C7A3C', width: 1.5, depth: 1.5, shape: 'tree' },
  { key: 'cypres', emoji: 'Cypres', label: 'Cypres', color: '#2E4A2E', width: 1.1, depth: 1.1, shape: 'treeTall' },
  { key: 'piscine', emoji: 'Piscine', label: 'Piscine', color: '#2E7FA8', width: 5.4, depth: 2.9, shape: 'pool' },
  { key: 'terrasse', emoji: 'Terrasse', label: 'Terrasse bois', color: '#8B5E30', width: 5.2, depth: 3.1, shape: 'deck' },
  { key: 'pergola', emoji: 'Pergola', label: 'Pergola', color: '#A0784C', width: 3.8, depth: 2.8, shape: 'deck' },
  { key: 'haie', emoji: 'Haie', label: 'Haie bocagere', color: '#2A5A2A', width: 4.5, depth: 0.8, shape: 'hedge' },
  { key: 'bassin', emoji: 'Bassin', label: 'Bassin', color: '#4A8A9C', width: 3.1, depth: 3.1, shape: 'pond' },
]

const PRESETS = {
  normande: ['lavande', 'cypres', 'bassin', 'haie'],
  villa: ['piscine', 'terrasse', 'lavande', 'olivier'],
  bois: ['haie', 'pergola', 'lavande', 'olivier'],
  bungalow: ['terrasse', 'pergola', 'haie', 'piscine'],
}

const DROP_POINTS = [
  { xPct: 0.28, zPct: 0.58 },
  { xPct: 0.64, zPct: 0.58 },
  { xPct: 0.36, zPct: 0.74 },
  { xPct: 0.6, zPct: 0.76 },
  { xPct: 0.22, zPct: 0.38 },
  { xPct: 0.74, zPct: 0.34 },
]

function makeHousePlacement(parcel) {
  return { x: parcel.houseX, z: parcel.houseZ }
}

function clampCenter(x, z, itemWidth, itemDepth, parcel) {
  const halfW = itemWidth / 2
  const halfD = itemDepth / 2

  return {
    x: Math.max(halfW, Math.min(parcel.width - halfW, x)),
    z: Math.max(halfD, Math.min(parcel.depth - halfD, z)),
  }
}

function makePlacedElement(key, parcel, index = 0) {
  const element = GARDEN_ELEMENTS.find((item) => item.key === key)
  const point = DROP_POINTS[index % DROP_POINTS.length]
  if (!element || !point) return null

  const unclampedX = point.xPct * parcel.width
  const unclampedZ = point.zPct * parcel.depth
  const clamped = clampCenter(unclampedX, unclampedZ, element.width, element.depth, parcel)

  return {
    ...element,
    id: `${key}_${Date.now()}_${index}`,
    x: clamped.x,
    z: clamped.z,
  }
}

function makePresetElements(houseKey, parcel) {
  return (PRESETS[houseKey] ?? []).map((presetKey, index) => makePlacedElement(presetKey, parcel, index)).filter(Boolean)
}

function shapeForElement(element) {
  const w = element.width
  const d = element.depth

  switch (element.shape) {
    case 'pool':
    case 'deck':
    case 'hedge':
      return <rect x={-w / 2} y={-d / 2} width={w} height={d} rx={Math.min(10, d / 4)} />
    case 'pond':
    case 'tree':
    case 'treeTall':
      return <ellipse cx="0" cy="0" rx={w / 2} ry={d / 2} />
    case 'patch':
    default:
      return <rect x={-w / 2} y={-d / 2} width={w} height={d} rx={6} />
  }
}

export default function Configurateur({ config, setConfig }) {
  const [viewerActive, setViewerActive] = useState(false)
  const [activeTool, setActiveTool] = useState(null)
  const house = HOUSE_STYLES.find((item) => item.key === config.house) || HOUSE_STYLES[0]
  const parcel = house.parcel
  const planWidth = parcel.planWidth ?? parcel.houseWidth
  const planDepth = parcel.planDepth ?? parcel.houseDepth
  const [housePlacement, setHousePlacement] = useState(() => makeHousePlacement(parcel))
  const [placedElements, setPlacedElements] = useState(() => makePresetElements(config.house, parcel))
  const [dragPaletteKey, setDragPaletteKey] = useState(null)
  const [dragging, setDragging] = useState(null)
  const groundRef = useRef(null)

  const viewBox = useMemo(() => `-2 -2 ${parcel.width + 4} ${parcel.depth + 4}`, [parcel.depth, parcel.width])
  const uniqueLabels = useMemo(() => [...new Set(placedElements.map((item) => item.label))], [placedElements])
  const activeToolLabel = activeTool ? GARDEN_ELEMENTS.find((item) => item.key === activeTool)?.label : ''

  useEffect(() => {
    const nextParcel = house.parcel
    const nextHousePlacement = makeHousePlacement(nextParcel)
    const nextPlaced = makePresetElements(config.house, nextParcel)
    setHousePlacement(nextHousePlacement)
    setPlacedElements(nextPlaced)
    setActiveTool(null)
    setConfig((current) => ({
      ...current,
      parcelId: house.parcelId,
      garden: (PRESETS[config.house] ?? []).slice(),
      layout: {
        house: nextHousePlacement,
        garden: nextPlaced.map(({ key, x, z }) => ({ key, x, z })),
      },
    }))
  }, [config.house, house.parcel, house.parcelId, setConfig])

  useEffect(() => {
    if (!dragging) return undefined

    const handlePointerMove = (event) => {
      const point = pointerToParcel(event, groundRef.current, parcel)
      if (!point) return

      if (dragging.type === 'house') {
        const next = clampCenter(
          point.x - dragging.offsetX,
          point.z - dragging.offsetZ,
          planWidth,
          planDepth,
          parcel,
        )
        setHousePlacement(next)
      } else {
        const draggedElement = placedElements.find((item) => item.id === dragging.id)
        if (!draggedElement) return

        const next = clampCenter(
          point.x - dragging.offsetX,
          point.z - dragging.offsetZ,
          draggedElement.width,
          draggedElement.depth,
          parcel,
        )

        setPlacedElements((current) =>
          current.map((item) => (item.id === dragging.id ? { ...item, x: next.x, z: next.z } : item)),
        )
      }
    }

    const handlePointerUp = () => {
      setDragging(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [dragging, parcel, placedElements, planDepth, planWidth])

  useEffect(() => {
    setConfig((current) => ({
      ...current,
      parcelId: house.parcelId,
      garden: placedElements.map((item) => item.key),
      layout: {
        house: housePlacement,
        garden: placedElements.map(({ key, x, z }) => ({ key, x, z })),
      },
    }))
  }, [housePlacement, house.parcelId, placedElements, setConfig])

  const selectHouse = (key) => {
    setConfig((current) => ({ ...current, house: key }))
    setViewerActive(false)
  }

  const addElementAtPoint = (key, point) => {
    const element = GARDEN_ELEMENTS.find((item) => item.key === key)
    if (!element || !point) return
    const next = clampCenter(point.x, point.z, element.width, element.depth, parcel)
    setPlacedElements((current) => [
      ...current,
      { ...element, id: `${key}_${Date.now()}`, x: next.x, z: next.z },
    ])
  }

  const removeElement = (id) => {
    setPlacedElements((current) => current.filter((item) => item.id !== id))
  }

  const handleGroundDrop = (event) => {
    event.preventDefault()
    if (!dragPaletteKey) return

    const point = pointerToParcel(event, groundRef.current, parcel)
    addElementAtPoint(dragPaletteKey, point)
    setDragPaletteKey(null)
    setActiveTool(null)
  }

  const handleGroundClick = (event) => {
    if (!activeTool || dragging) return
    const point = pointerToParcel(event, groundRef.current, parcel)
    addElementAtPoint(activeTool, point)
    setActiveTool(null)
  }

  const startHouseDrag = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const point = pointerToParcel(event, groundRef.current, parcel)
    if (!point) return

    setDragging({
      type: 'house',
      offsetX: point.x - housePlacement.x,
      offsetZ: point.z - housePlacement.z,
    })
  }

  const startElementDrag = (event, element) => {
    event.preventDefault()
    event.stopPropagation()
    const point = pointerToParcel(event, groundRef.current, parcel)
    if (!point) return

    setDragging({
      type: 'element',
      id: element.id,
      offsetX: point.x - element.x,
      offsetZ: point.z - element.z,
    })
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

          <div className={s.contextCard}>
            <span className={s.contextBadge}>Parcelle {house.parcelId}</span>
            <span className={s.contextDims}>
              {parcel.width} m × {parcel.depth} m
            </span>
            <p className={s.contextCopy}>
              Vous placez actuellement les elements sur la parcelle {house.parcelId}, avec la meme emprise que dans la scene 3D.
            </p>
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
                  <span className={s.houseParcel}>Parcelle {item.parcelId}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={s.block}>
            <p className={s.blockLabel}>Elements de jardin</p>
            <p className={s.blockHint}>
              Glissez sur le plan, ou choisissez un element puis cliquez a l&apos;endroit voulu.
            </p>
            <div className={s.gardenPalette}>
              {GARDEN_ELEMENTS.map((item) => (
                <button
                  key={item.key}
                  className={`${s.gardenEl} ${activeTool === item.key ? s.gardenElActive : ''}`}
                  draggable
                  onDragStart={() => setDragPaletteKey(item.key)}
                  onDragEnd={() => setDragPaletteKey(null)}
                  onClick={() => setActiveTool((current) => (current === item.key ? null : item.key))}
                  style={{ '--el-color': item.color }}
                  type="button"
                >
                  <span className={s.gardenEmoji}>{item.emoji}</span>
                  <span className={s.gardenLabel}>{item.label}</span>
                </button>
              ))}
            </div>
            {activeToolLabel && <p className={s.toolHint}>Cliquez sur le plan pour placer: {activeToolLabel}</p>}
          </div>

          <button className={s.btn3d} onClick={() => setViewerActive((value) => !value)} type="button">
            {viewerActive ? 'Fermer la vue 3D' : 'Ouvrir la vue 3D'}
          </button>
          <p className={s.viewerNote}>
            Le plan 2D et la scene 3D utilisent la meme parcelle en metres. Deplacez la maison,
            puis les elements de jardin, et retrouvez-les au meme endroit en 3D.
          </p>
        </div>

        <div className={s.preview}>
          {viewerActive ? (
            <Suspense fallback={<div className={s.sceneLoading}>Chargement de la scene 3D...</div>}>
              <ThreeSceneViewer
                house={house}
                housePlacement={housePlacement}
                placedElements={placedElements}
                onClose={() => setViewerActive(false)}
              />
            </Suspense>
          ) : (
            <div
              ref={groundRef}
              className={s.ground}
              style={{ aspectRatio: `${parcel.width} / ${parcel.depth}` }}
              onClick={handleGroundClick}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleGroundDrop}
            >
              <svg className={s.groundSvg} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-label={`Plan de la parcelle ${house.parcelId}`}>
                <rect x="0" y="0" width={parcel.width} height={parcel.depth} fill="#e8e4da" stroke="#c4a882" strokeWidth="0.32" />
                <g
                  transform={`translate(${housePlacement.x} ${housePlacement.z}) rotate(${(parcel.rotation * 180) / Math.PI})`}
                  className={s.houseShape}
                  onPointerDown={startHouseDrag}
                >
                  <rect
                    x={-planWidth / 2}
                    y={-planDepth / 2}
                    width={planWidth}
                    height={planDepth}
                    rx="0.8"
                    fill="#d4c8b8"
                    stroke="#9a7a5a"
                    strokeWidth="0.28"
                  />
                  <text y="0.35" textAnchor="middle" className={s.houseText}>
                    Emprise maison
                  </text>
                </g>

                {placedElements.map((element) => (
                  <g
                    key={element.id}
                    transform={`translate(${element.x} ${element.z})`}
                    className={s.planItem}
                    onPointerDown={(event) => startElementDrag(event, element)}
                    onDoubleClick={() => removeElement(element.id)}
                  >
                    <g fill={element.color} stroke="rgba(30,28,24,0.35)" strokeWidth={0.18}>
                      {shapeForElement(element)}
                    </g>
                    <text y={0.35} textAnchor="middle" className={s.planItemText}>
                      {element.label}
                    </text>
                  </g>
                ))}

                <text x={1.2} y="2.2" textAnchor="start" className={s.planParcelLabel}>
                  Parcelle {house.parcelId}
                </text>
                <text x={parcel.width - 1.2} y="1.8" textAnchor="end" className={s.planNorth}>N</text>
                <line x1={parcel.width - 1.2} y1="2.4" x2={parcel.width - 1.2} y2="5.8" stroke="#a8a090" strokeWidth="0.18" />
                <line x1="1.2" y1={parcel.depth + 1.2} x2="11.2" y2={parcel.depth + 1.2} stroke="#a8a090" strokeWidth="0.18" />
                <text x="6.2" y={parcel.depth + 2.2} textAnchor="middle" className={s.planScale}>10m</text>
              </svg>

              <div className={s.planLegend}>
                <span className={s.legendChip}>Parcelle {house.parcelId}</span>
                <span className={s.legendChip}>Maison deplacable</span>
                <span className={s.legendChip}>Double-clic pour retirer un element</span>
              </div>
            </div>
          )}

          <div className={s.summary}>
            <span className={s.summaryItem}>
              <strong>{house.label}</strong>
            </span>
            <span className={s.summaryGarden}>Parcelle {house.parcelId}</span>
            <span className={s.summaryGarden}>
              Maison a {housePlacement.x.toFixed(1)} m / {housePlacement.z.toFixed(1)} m
            </span>
            {uniqueLabels.length > 0 && <span className={s.summaryGarden}>+ {uniqueLabels.join(', ')}</span>}
            <button
              className={s.summaryClear}
              onClick={() => {
                setHousePlacement(makeHousePlacement(parcel))
                setPlacedElements(makePresetElements(config.house, parcel))
                setActiveTool(null)
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

function pointerToParcel(event, element, parcel) {
  if (!element) return null
  const rect = element.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * parcel.width
  const z = ((event.clientY - rect.top) / rect.height) * parcel.depth
  return {
    x: Math.max(0, Math.min(parcel.width, x)),
    z: Math.max(0, Math.min(parcel.depth, z)),
  }
}
