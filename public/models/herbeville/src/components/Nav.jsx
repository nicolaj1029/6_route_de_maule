import styles from './Nav.module.css'

export default function Nav() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <nav className={styles.nav}>
      <span className={styles.logo}>Herbeville | Route Maule</span>
      <div className={styles.links}>
        <button className={styles.link} onClick={() => scrollTo('map-sec')}>Carte</button>
        <button className={styles.link} onClick={() => scrollTo('config-sec')}>Projet</button>
        <button className={styles.link} onClick={() => scrollTo('contact-sec')}>Contact</button>
        <button className={styles.cta} onClick={() => scrollTo('contact-sec')}>
          Demande de visite
        </button>
      </div>
    </nav>
  )
}
