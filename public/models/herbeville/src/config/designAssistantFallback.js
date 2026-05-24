const KEYWORDS = {
  house: [
    { value: 'bois', needles: ['bois', 'wood', 'timber', 'eco', 'ecologique', 'ecology', 'naturel'] },
    { value: 'bungalow', needles: ['bungalow', 'plain-pied', 'single-storey', 'single story', 'minimaliste'] },
    { value: 'normand', needles: ['francais', 'french', 'normand', 'traditionnel', 'traditional', 'campagne'] },
  ],
  roof: [
    { value: 'plat', needles: ['plat', 'flat roof', 'toit-terrasse', 'roof terrace'] },
    { value: 'zinc', needles: ['zinc', 'metal roof', 'metal'] },
    { value: 'pentes', needles: ['pentes', 'gable', 'pitched', 'saddeltag'] },
  ],
  mood: [
    { value: 'vacances', needles: ['vacances', 'summer', 'holiday', 'sommerhus'] },
    { value: 'archi', needles: ['architecte', 'architecture', 'contemporain', 'prestige', 'design', 'moderne arkitektur'] },
    { value: 'nature', needles: ['nature', 'ecologie', 'permaculture', 'landscape', 'naturgrund'] },
  ],
  garden: [
    { value: 'lavande', needles: ['lavande', 'lavender'] },
    { value: 'oliviers', needles: ['olivier', 'oliviers', 'olive tree', 'olive trees'] },
    { value: 'piscine', needles: ['piscine', 'pool', 'swimming pool'] },
    { value: 'haie', needles: ['haie', 'hedge', 'haek'] },
    { value: 'terrasse', needles: ['terrasse', 'deck', 'terrace'] },
    { value: 'pergola', needles: ['pergola'] },
    { value: 'bassin', needles: ['bassin', 'pond', 'water feature'] },
    { value: 'prairie', needles: ['prairie', 'meadow', 'wild garden', 'nature ground'] },
  ],
}

function containsAny(haystack, needles) {
  return needles.some((needle) => haystack.includes(needle))
}

export function inferDesignAssistantConfig(prompt) {
  const normalized = prompt.toLowerCase()

  const houseMatch = KEYWORDS.house.find(({ needles }) => containsAny(normalized, needles))
  const roofMatch = KEYWORDS.roof.find(({ needles }) => containsAny(normalized, needles))
  const moodMatch = KEYWORDS.mood.find(({ needles }) => containsAny(normalized, needles))
  const gardenMatches = KEYWORDS.garden
    .filter(({ needles }) => containsAny(normalized, needles))
    .map(({ value }) => value)

  const config = {
    house: houseMatch?.value ?? 'moderne',
    roof: roofMatch?.value ?? 'tuile',
    garden: gardenMatches.length > 0 ? gardenMatches : ['lavande', 'terrasse'],
    mood: moodMatch?.value ?? 'famille',
  }

  return {
    desc: 'Mode autonome: la description a ete interpretee localement pour generer une configuration coherente du terrain.',
    blender: `Low-poly residential concept on a French building lot in Herbeville, ${config.house} house, ${config.roof} roof, ${config.garden.join(', ')} garden elements, sale-oriented exterior render.`,
    tags: [config.house, config.roof, config.mood, ...config.garden],
    config,
    source: 'frontend-fallback',
  }
}
