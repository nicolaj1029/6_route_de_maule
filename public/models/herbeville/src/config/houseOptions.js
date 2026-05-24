import { assetPath } from './assets.js'

/**
 * houseOptions.js - all configurator options for house and roof types.
 * Add new GLB paths here as you produce them in Blender.
 */

export const HOUSE_STYLES = [
  {
    key: 'moderne',
    label: 'Villa moderne',
    desc: 'Grandes baies vitrees, lignes epurees',
    icon: 'Maison A',
    glb: assetPath('models/villa-moderne.glb'),
    parcelGlb: assetPath('models/parcel-b-villa-moderne.glb'),
    parcelLabel: 'Parcelle projettee',
    bodyColor: '#E8DDD0',
  },
  {
    key: 'normand',
    label: 'Maison francaise',
    desc: 'Charme traditionnel et volumes plus classiques',
    icon: 'Maison B',
    glb: assetPath('models/maison-normande.glb'),
    parcelGlb: assetPath('models/parcel-a-maison-normande.glb'),
    parcelLabel: 'Parcelle projettee',
    bodyColor: '#F0E8D8',
  },
  {
    key: 'bois',
    label: 'Maison en bois',
    desc: 'Materiaux naturels, architecture ecologique',
    icon: 'Maison C',
    glb: assetPath('models/chalet-bois.glb'),
    bodyColor: '#C8A878',
  },
  {
    key: 'bungalow',
    label: 'Bungalow',
    desc: 'Plain-pied, minimaliste, accessible',
    icon: 'Maison D',
    glb: assetPath('models/bungalow.glb'),
    bodyColor: '#DEDED8',
  },
]

export const SITE_SCENES = [
  {
    key: 'site-context',
    label: 'Contexte du terrain',
    desc: 'Volume global de la parcelle et de son implantation',
    glb: assetPath('models/site-context.glb'),
  },
]

export const ROOF_STYLES = [
  {
    key: 'tuile',
    label: 'Tuile terre cuite',
    desc: 'Traditionnel, chaleureux',
    icon: 'Tuile',
    svgColor: '#8A5C3A',
    svgPoints: '150,130 250,65 350,130',
  },
  {
    key: 'zinc',
    label: 'Zinc contemporain',
    desc: 'Moderne, longue duree',
    icon: 'Zinc',
    svgColor: '#7A8A8A',
    svgPoints: '150,130 250,65 350,130',
  },
  {
    key: 'plat',
    label: 'Toit plat',
    desc: 'Terrasse accessible, vues degagees',
    icon: 'Plat',
    svgColor: '#5A5A5A',
    svgPoints: '150,125 350,125 350,130 150,130',
  },
  {
    key: 'pentes',
    label: 'Deux pentes',
    desc: 'Classique, combles amenageables',
    icon: 'Pentes',
    svgColor: '#6A4A28',
    svgPoints: '150,130 250,65 350,130',
  },
]
