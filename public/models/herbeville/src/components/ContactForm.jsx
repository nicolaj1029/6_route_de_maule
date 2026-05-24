import { useState } from 'react'
import { PROPERTY } from '../config/property.js'
import styles from './ContactForm.module.css'

const PROJECT_TYPES = [
  'Residence principale',
  'Maison de vacances',
  'Investissement locatif',
  'Projet architectural',
  'Autre',
]

export default function ContactForm({ config }) {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', projet: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const set = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))

  const isDemoMode = PROPERTY.formspreeId === 'VOTRE_FORMSPREE_ID'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    if (isDemoMode) {
      window.setTimeout(() => {
        setStatus('success')
      }, 700)
      return
    }

    const payload = new FormData()
    Object.entries(form).forEach(([key, value]) => payload.append(key, value))
    payload.append('configuration', JSON.stringify(config))
    payload.append('_subject', 'Demande de renseignements | 6 Route Maule, Herbeville')

    try {
      const res = await fetch(`https://formspree.io/f/${PROPERTY.formspreeId}`, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data?.error || 'Erreur serveur. Reessayez.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Erreur reseau. Verifiez votre connexion.')
      setStatus('error')
    }
  }

  return (
    <section className={styles.section} id="contact-sec">
      <span className="section-label" style={{ color: 'rgba(255,255,255,0.55)' }}>Contact</span>
      <h2 className={styles.title}>Passer du concept a la visite</h2>
      <p className={styles.body}>
        Cette page a vocation a vendre une possibilite concrete. Laissez un message pour demander
        une visite, partager un projet ou valider l&apos;interet urbanistique du terrain.
      </p>

      {status === 'success' ? (
        <div className={styles.success}>
          <span className={styles.successIcon}>OK</span>
          <p>Votre message a ete pris en compte. Nous reviendrons vers vous rapidement.</p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.row}>
            <Field label="Prenom" value={form.prenom} onChange={set('prenom')} placeholder="Jean" required />
            <Field label="Nom" value={form.nom} onChange={set('nom')} placeholder="Dupont" required />
          </div>
          <div className={styles.row}>
            <Field label="Email" type="email" value={form.email} onChange={set('email')} placeholder="jean@exemple.fr" required />
            <Field label="Telephone" type="tel" value={form.telephone} onChange={set('telephone')} placeholder="+33 6 00 00 00 00" />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Type de projet</label>
            <select className={styles.input} value={form.projet} onChange={set('projet')}>
              <option value="">Selectionnez votre projet...</option>
              {PROJECT_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Message</label>
            <textarea
              className={styles.input}
              value={form.message}
              onChange={set('message')}
              placeholder="Votre projet, vos questions, vos disponibilites pour une visite..."
              rows={4}
            />
          </div>

          {status === 'error' && <p className={styles.errorMsg}>{errorMsg}</p>}

          <input type="hidden" name="configuration" value={JSON.stringify(config)} readOnly />

          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Envoi en cours...' : 'Envoyer ma demande'}
          </button>

          {isDemoMode && (
            <p className={styles.devNote}>
              Mode demo actif: remplacez <code>VOTRE_FORMSPREE_ID</code> dans <code>src/config/property.js</code>
              pour activer l&apos;envoi reel.
            </p>
          )}
        </form>
      )}
    </section>
  )
}

function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.28rem', flex: 1 }}>
      <label style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: '4px',
          padding: '0.62rem 0.78rem',
          color: 'white',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.82rem',
          outline: 'none',
          width: '100%',
        }}
      />
    </div>
  )
}
