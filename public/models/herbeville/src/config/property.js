import { assetPath } from './assets.js'

export const PROPERTY = {
  address: '6 Route Maule',
  city: 'Herbeville',
  postcode: '78580',
  department: 'Yvelines',
  region: 'Ile-de-France',
  country: 'France',

  lat: 48.90785295,
  lng: 1.87884956,

  surfaceM2: 850,
  distanceParis: 48,
  permit: 'CU+',

  contactEmail: 'contact@herbeville-terrain.fr',
  formspreeId: 'VOTRE_FORMSPREE_ID',

  googleEarthUrl: 'https://earth.google.com/web/@48.90785295,1.87884956,200a,800d,35y,0h,45t,0r',
  googleMapsUrl: 'https://maps.google.com/?q=48.90785295,1.87884956',
  geoportailUrl: 'https://www.geoportail.gouv.fr/carte?c=1.87884956,48.90785295&z=17',

  heroHighlights: [
    'Village preserve du Vexin',
    'Projection maison + jardin',
    'Acces rapide vers Paris',
  ],

  mapHighlights: [
    'Vue Google Earth sans integration complexe',
    'Fallback simple vers Google Maps et Geoportail',
    'Base prete pour Cesium ou 3D Tiles plus tard',
  ],

  photos: [
    { src: assetPath('images/terrain-01.webp'), alt: 'Vue principale du terrain' },
    { src: assetPath('images/terrain-02.webp'), alt: 'Vue depuis la route' },
    { src: assetPath('images/terrain-03.webp'), alt: 'Vue aerienne du terrain' },
  ],
}
