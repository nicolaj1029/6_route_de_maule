import { PROPERTY } from '../config/property.js'
import s from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <span className={s.brand}>
          {PROPERTY.address} - {PROPERTY.city} - {PROPERTY.postcode}
        </span>
        <span className={s.coords}>
          {PROPERTY.lat} N, {PROPERTY.lng} E
        </span>
        <span className={s.stack}>React - Vite - model-viewer - Formspree - Blender</span>
      </div>
    </footer>
  )
}
