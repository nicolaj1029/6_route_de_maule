import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { Box3, Color, Vector3 } from 'three'
import s from './ThreeSceneViewer.module.css'

const BEDROCK = new Color('#ddd5c4')
const GRASS = new Color('#7d8f61')
const HEDGE = new Color('#48603c')
const LAVENDER = new Color('#8d77b4')
const WATER = new Color('#62a9c9')
const TIMBER = new Color('#9a7148')
const CYPRESS = new Color('#2f4b31')
const OLIVE = new Color('#7e9362')

export default function ThreeSceneViewer({ house, housePlacement, placedElements, onClose }) {
  const { width, depth } = house.parcel

  return (
    <div className={s.wrap}>
      <div className={s.canvasWrap}>
        <Canvas camera={{ position: [width * 0.4, Math.max(width, depth) * 0.65, depth * 0.9], fov: 42 }}>
          <color attach="background" args={['#e8e0d1']} />
          <fog attach="fog" args={['#e8e0d1', 45, 95]} />
          <ambientLight intensity={1.15} />
          <directionalLight position={[18, 26, 14]} intensity={2.2} castShadow />
          <Suspense fallback={null}>
            <ParcelScene house={house} housePlacement={housePlacement} placedElements={placedElements} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            minDistance={12}
            maxDistance={58}
            maxPolarAngle={Math.PI / 2.1}
            target={[0, 0, 0]}
          />
        </Canvas>
      </div>

      <div className={s.bar}>
        <div className={s.meta}>
          <span className={s.label}>{house.label}</span>
          <span className={s.dimensions}>Parcelle {house.parcelId} · {width} m x {depth} m</span>
          <span className={s.note}>Les ajouts jardin sont convertis du plan 2D vers cette base metriquement stable.</span>
        </div>
        <button className={s.closeBtn} onClick={onClose} type="button">
          Retour au plan 2D
        </button>
      </div>
    </div>
  )
}

function ParcelScene({ house, housePlacement, placedElements }) {
  const { width, depth, houseWidth, houseDepth, rotation } = house.parcel
  const housePosition = useMemo(
    () => [-(width / 2) + housePlacement.x, 0, -(depth / 2) + housePlacement.z],
    [depth, housePlacement.x, housePlacement.z, width],
  )
  const sceneItems = useMemo(() => placedElements, [placedElements])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.18, 0]} receiveShadow>
        <planeGeometry args={[width + 16, depth + 16]} />
        <meshStandardMaterial color={BEDROCK} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color={GRASS} />
      </mesh>

      <LotOutline width={width} depth={depth} />
      <HouseFootprint width={houseWidth} depth={houseDepth} position={housePosition} rotation={rotation} />
      <ScaledHouseModel
        glb={house.glb}
        footprint={{ width: houseWidth, depth: houseDepth }}
        position={housePosition}
        rotation={rotation}
      />

      {sceneItems.map((item) => (
        <GardenObject key={item.id} item={item} parcelWidth={width} parcelDepth={depth} />
      ))}
    </group>
  )
}

function LotOutline({ width, depth }) {
  return (
    <>
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color="#90a36c" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[width + 0.15, 0.18, depth + 0.15]} />
        <meshStandardMaterial color="#c59d72" wireframe />
      </mesh>
    </>
  )
}

function HouseFootprint({ width, depth, position, rotation }) {
  return (
    <mesh position={[position[0], 0.06, position[2]]} rotation={[0, rotation, 0]} receiveShadow>
      <boxGeometry args={[width, 0.12, depth]} />
      <meshStandardMaterial color="#c5ae8f" />
    </mesh>
  )
}

function ScaledHouseModel({ glb, footprint, position, rotation }) {
  const { scene } = useGLTF(glb)
  const { cloned, scale, center, minY } = useMemo(() => {
    const clone = scene.clone(true)
    stripEmbeddedSiteElements(clone)
    const box = new Box3().setFromObject(clone)
    const size = new Vector3()
    const centerVec = new Vector3()
    box.getSize(size)
    box.getCenter(centerVec)
    const widthScale = footprint.width / Math.max(size.x, 0.001)
    const depthScale = footprint.depth / Math.max(size.z, 0.001)
    const resolvedScale = Math.min(widthScale, depthScale)

    return {
      cloned: clone,
      scale: resolvedScale,
      center: centerVec,
      minY: box.min.y,
    }
  }, [scene, footprint.depth, footprint.width])

  return (
    <group position={[position[0], 0.06, position[2]]} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={cloned} position={[-center.x, -minY, -center.z]} />
    </group>
  )
}

function stripEmbeddedSiteElements(root) {
  const hiddenKeywords = ['ground', 'path', 'gravel', 'pool', 'terrace']
  const hiddenNodePrefixes = ['M_Ground', 'M_Terrace', 'M_Pool', 'N_Ground', 'N_Path', 'BG_Ground', 'BG_Gravel', 'BG_Pool', 'B_Ground']

  root.traverse((object) => {
    if (!object.isMesh) return

    const nodeName = (object.name || '').toLowerCase()
    const materialNames = Array.isArray(object.material)
      ? object.material.map((material) => (material?.name || '').toLowerCase())
      : [(object.material?.name || '').toLowerCase()]

    const shouldHideByNode = hiddenNodePrefixes.some((prefix) => object.name?.startsWith(prefix))
      || hiddenKeywords.some((keyword) => nodeName.includes(keyword))
    const shouldHideByMaterial = materialNames.some((name) => hiddenKeywords.some((keyword) => name.includes(keyword)))

    if (shouldHideByNode || shouldHideByMaterial) {
      object.visible = false
    }
  })
}

function GardenObject({ item, parcelWidth, parcelDepth }) {
  const position = [item.x - parcelWidth / 2, 0, item.z - parcelDepth / 2]

  switch (item.key) {
    case 'lavande':
      return <LavenderPatch position={position} />
    case 'olivier':
      return <OliveTree position={position} />
    case 'cypres':
      return <CypressTree position={position} />
    case 'piscine':
      return <Pool position={position} />
    case 'terrasse':
      return <Terrace position={position} />
    case 'pergola':
      return <Pergola position={position} />
    case 'haie':
      return <Hedge position={position} />
    case 'bassin':
      return <Pond position={position} />
    default:
      return null
  }
}

function LavenderPatch({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.08, 2.2]} />
        <meshStandardMaterial color="#6f8551" />
      </mesh>
      {[-1.4, -0.4, 0.6, 1.5].map((x) => (
        <mesh key={x} position={[x, 0.28, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.45, 6]} />
          <meshStandardMaterial color={LAVENDER} />
        </mesh>
      ))}
    </group>
  )
}

function OliveTree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.18, 1.1, 7]} />
        <meshStandardMaterial color={TIMBER} />
      </mesh>
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.72, 14, 14]} />
        <meshStandardMaterial color={OLIVE} />
      </mesh>
    </group>
  )
}

function CypressTree({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.52, 2.2, 10]} />
        <meshStandardMaterial color={CYPRESS} />
      </mesh>
    </group>
  )
}

function Pool({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <boxGeometry args={[5.4, 0.2, 2.9]} />
        <meshStandardMaterial color="#d6d9de" />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[4.9, 0.08, 2.4]} />
        <meshStandardMaterial color={WATER} transparent opacity={0.92} />
      </mesh>
    </group>
  )
}

function Terrace({ position }) {
  return (
    <mesh position={[position[0], 0.06, position[2]]} receiveShadow>
      <boxGeometry args={[5.2, 0.12, 3.1]} />
      <meshStandardMaterial color={TIMBER} />
    </mesh>
  )
}

function Pergola({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.14, 2.8]} />
        <meshStandardMaterial color="#b3895d" />
      </mesh>
      {[
        [-1.7, 0.8, -1.2],
        [1.7, 0.8, -1.2],
        [-1.7, 0.8, 1.2],
        [1.7, 0.8, 1.2],
      ].map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.14, 1.6, 0.14]} />
          <meshStandardMaterial color="#8e6845" />
        </mesh>
      ))}
    </group>
  )
}

function Hedge({ position }) {
  return (
    <mesh position={[position[0], 0.55, position[2]]} castShadow receiveShadow>
      <boxGeometry args={[4.5, 1.1, 0.8]} />
      <meshStandardMaterial color={HEDGE} />
    </mesh>
  )
}

function Pond({ position }) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[1.55, 24]} />
        <meshStandardMaterial color="#a6b6b2" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
        <circleGeometry args={[1.28, 24]} />
        <meshStandardMaterial color={WATER} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
