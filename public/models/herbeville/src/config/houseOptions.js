import { assetPath } from './assets.js'

/**
 * houseOptions.js — all configurator options for house and roof types.
 * Add new GLB paths here as you produce them in Blender.
 */

export const HOUSE_STYLES = [
  {
    key:   'moderne',
    label: 'Villa moderne',
    desc:  'Grandes baies vitrées, lignes épurées',
    icon:  '🏛️',
    // Place Blender-exported GLB at this path in /public/models/
    glb:   assetPath('models/villa-moderne.glb'),
    // Fallback colour for SVG preview
    bodyColor: '#E8DDD0',
  },
  {
    key:   'normand',
    label: 'Maison française',
    desc:  'Colombages, charme traditionnel normand',
    icon:  '🏡',
    glb:   assetPath('models/maison-normande.glb'),
    bodyColor: '#F0E8D8',
  },
  {
    key:   'bois',
    label: 'Maison en bois',
    desc:  'Matériaux naturels, architecture écologique',
    icon:  '🌲',
    glb:   assetPath('models/chalet-bois.glb'),
    bodyColor: '#C8A878',
  },
  {
    key:   'bungalow',
    label: 'Bungalow',
    desc:  'Plain-pied, minimaliste, accessible',
    icon:  '🏠',
    glb:   assetPath('models/bungalow.glb'),
    bodyColor: '#DEDED8',
  },
]

export const ROOF_STYLES = [
  {
    key:       'tuile',
    label:     'Tuile terre cuite',
    desc:      'Traditionnel, chaleureux',
    icon:      '🟤',
    svgColor:  '#8A5C3A',
    svgPoints: '150,130 250,65 350,130', // triangle roof
  },
  {
    key:       'zinc',
    label:     'Zinc contemporain',
    desc:      'Moderne, longue durée',
    icon:      '🩶',
    svgColor:  '#7A8A8A',
    svgPoints: '150,130 250,65 350,130',
  },
  {
    key:       'plat',
    label:     'Toit plat',
    desc:      'Terrasse accessible, vues dégagées',
    icon:      '⬛',
    svgColor:  '#5A5A5A',
    svgPoints: '150,125 350,125 350,130 150,130', // flat strip
  },
  {
    key:       'pentes',
    label:     'Deux pentes',
    desc:      'Classique, combles aménageables',
    icon:      '🔺',
    svgColor:  '#6A4A28',
    svgPoints: '150,130 250,65 350,130',
  },
]
