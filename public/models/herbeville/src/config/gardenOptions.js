/**
 * gardenOptions.js — garden and mood configurator options.
 */

export const GARDEN_ELEMENTS = [
  { key: 'lavande',  label: 'Lavande',         icon: '🌿', affectsSVG: 'lavender' },
  { key: 'oliviers', label: 'Oliviers',         icon: '🫒', affectsSVG: null },
  { key: 'piscine',  label: 'Piscine',          icon: '🏊', affectsSVG: 'pool' },
  { key: 'haie',     label: 'Haie bocagère',    icon: '🌿', affectsSVG: null },
  { key: 'terrasse', label: 'Terrasse bois',    icon: '🪵', affectsSVG: null },
  { key: 'pergola',  label: 'Pergola',          icon: '🌳', affectsSVG: null },
  { key: 'bassin',   label: 'Bassin',           icon: '⛲', affectsSVG: null },
  { key: 'prairie',  label: 'Prairie naturelle', icon: '🌾', affectsSVG: null },
]

export const MOOD_OPTIONS = [
  {
    key:   'famille',
    label: 'Résidence famille',
    desc:  'Espace, sécurité, confort',
    icon:  '👨‍👩‍👧',
  },
  {
    key:   'vacances',
    label: 'Maison de vacances',
    desc:  'Nature, dépaysement, détente',
    icon:  '☀️',
  },
  {
    key:   'archi',
    label: "Architecture d'auteur",
    desc:  'Design, prestige, unicité',
    icon:  '✦',
  },
  {
    key:   'nature',
    label: 'Retour à la nature',
    desc:  'Écologie, permaculture',
    icon:  '🌱',
  },
]
