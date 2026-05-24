import { PROPERTY } from '../config/property.js'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <strong>
        {PROPERTY.address} | {PROPERTY.city} | {PROPERTY.postcode} | {PROPERTY.department}
      </strong>
      <span>
        {PROPERTY.lat} N | {PROPERTY.lng} E | {PROPERTY.region} | {PROPERTY.country}
      </span>
      <span className={styles.stack}>
        React + Vite | Cake-hosted build | model-viewer on demand | Formspree | Cesium-ready
      </span>
    </footer>
  )
}
