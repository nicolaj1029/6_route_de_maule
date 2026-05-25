import { assetPath } from './assets.js'

export const PROPERTY = {
  address: '6 Route de Maule',
  city: 'Herbeville',
  postcode: '78580',
  department: 'Yvelines',
  region: 'Ile-de-France',
  country: 'France',

  lat: 48.90785295,
  lng: 1.87884956,

  formspreeId: 'VOTRE_FORMSPREE_ID',
  googleEarthUrl: 'https://earth.google.com/web/@48.90785295,1.87884956,200a,800d,35y,0h,45t,0r',
  googleMapsUrl: 'https://maps.google.com/?q=48.90785295,1.87884956',
  geoportailUrl: 'https://www.geoportail.gouv.fr/carte?c=1.87884956,48.90785295&z=17',

  heroSlides: [
    { src: assetPath('images/terrain-01.png'), label: 'Parcelle A - implantation normande' },
    { src: assetPath('images/terrain-02.png'), label: 'Parcelle B - implantation contemporaine' },
  ],

  parcels: [
    {
      id: 'A',
      label: 'Parcelle A',
      name: 'Maison Normande',
      surface: '~1 100 m²',
      dims: '42 × 30 m',
      style: 'Une implantation familiale au vocabulaire vernaculaire, ouverte sur le jardin et les vues du Vexin.',
      tags: ['Lavande', 'Cypres', 'Bassin', 'Terrasse'],
      render: assetPath('images/terrain-01.png'),
      glb: assetPath('models/parcel-a-maison-normande.glb'),
      houseKey: 'normande',
    },
    {
      id: 'B',
      label: 'Parcelle B',
      name: 'Villa Contemporaine',
      surface: '~800 m²',
      dims: '48 × 16 m',
      style: 'Un projet plus lineaire et contemporain, pense pour une terrasse, une piscine et un mode de vie dedans-dehors.',
      tags: ['Piscine', 'Pergola', 'Lavande', 'Olivier'],
      render: assetPath('images/terrain-02.png'),
      glb: assetPath('models/parcel-b-villa-moderne.glb'),
      houseKey: 'villa',
    },
  ],
}
