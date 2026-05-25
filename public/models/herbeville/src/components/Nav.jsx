import { useEffect, useState } from 'react'
import s from './Nav.module.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`${s.nav} ${scrolled ? s.navScrolled : ''}`}>
      <span className={s.logo}>Herbeville</span>
      <div className={s.links}>
        <button className={s.link} onClick={() => scroll('parcelles')} type="button">
          Parcelles
        </button>
        <button className={s.link} onClick={() => scroll('acces')} type="button">
          Acces
        </button>
        <button className={s.link} onClick={() => scroll('configurateur')} type="button">
          Projet
        </button>
        <button className={s.link} onClick={() => scroll('contact')} type="button">
          Contact
        </button>
        <button className={s.cta} onClick={() => scroll('contact')} type="button">
          Demande de visite
        </button>
      </div>
    </nav>
  )
}
