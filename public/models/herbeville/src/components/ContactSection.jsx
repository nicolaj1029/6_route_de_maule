import { useState } from 'react'
import { PROPERTY } from '../config/property.js'
import s from './ContactSection.module.css'

const PROJECT_TYPES = [
  'Residence principale',
  'Maison de campagne',
  'Investissement patrimonial',
  'Projet architectural sur mesure',
]

export default function ContactSection({ config }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', tel: '', projet: '', message: '' })

  const setField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const isDemoMode = PROPERTY.formspreeId === 'VOTRE_FORMSPREE_ID'

  const submit = async (event) => {
    event.preventDefault()
    setSending(true)

    if (isDemoMode) {
      window.setTimeout(() => {
        setSending(false)
        setSent(true)
      }, 700)
      return
    }

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => formData.append(key, value))
      formData.append('configuration', JSON.stringify(config))
      formData.append('_subject', '6 Route de Maule - Demande de renseignements')

      const response = await fetch(`https://formspree.io/f/${PROPERTY.formspreeId}`, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setSent(true)
      }
    } catch {
      // silent in prototype mode
    }

    setSending(false)
  }

  return (
    <section className={s.section} id="contact">
      <div className={s.inner}>
        <div className={s.left}>
          <p className="t-label" style={{ color: 'var(--gold)' }}>
            Passer a la visite
          </p>
          <h2 className={s.title}>
            Interesse
            <br />
            par ce terrain ?
          </h2>
          <p className={s.body}>
            Reponse garantie sous 24h.
            <br />
            Visites sur rendez-vous et dossier sur demande.
          </p>

          <div className={s.address}>
            <p>{PROPERTY.address}</p>
            <p>
              {PROPERTY.postcode} {PROPERTY.city}, {PROPERTY.department}
            </p>
            <p style={{ marginTop: '0.4rem', opacity: 0.5, fontSize: '0.7rem', letterSpacing: '0.08em' }}>
              {PROPERTY.lat} N - {PROPERTY.lng} E
            </p>
          </div>
        </div>

        <div className={s.right}>
          {sent ? (
            <div className={s.success}>
              <span className={s.successMark}>OK</span>
              <p>Message envoye. Nous vous recontacterons sous 24h.</p>
            </div>
          ) : (
            <form className={s.form} onSubmit={submit}>
              <div className={s.row}>
                <Field label="Prenom" value={form.prenom} onChange={setField('prenom')} required />
                <Field label="Nom" value={form.nom} onChange={setField('nom')} required />
              </div>
              <div className={s.row}>
                <Field label="Email" type="email" value={form.email} onChange={setField('email')} required />
                <Field label="Telephone" type="tel" value={form.tel} onChange={setField('tel')} />
              </div>
              <div className={s.field}>
                <label className={s.label}>Projet</label>
                <select className={s.input} value={form.projet} onChange={setField('projet')}>
                  <option value="">Selectionnez...</option>
                  {PROJECT_TYPES.map((project) => (
                    <option key={project}>{project}</option>
                  ))}
                </select>
              </div>
              <div className={s.field}>
                <label className={s.label}>Message</label>
                <textarea
                  className={s.input}
                  value={form.message}
                  onChange={setField('message')}
                  rows={4}
                  placeholder="Votre projet, votre calendrier, vos questions..."
                />
              </div>
              {isDemoMode && (
                <p className={s.devNote}>Mode demo actif: remplacez VOTRE_FORMSPREE_ID dans config/property.js</p>
              )}
              <button type="submit" className={s.submit} disabled={sending}>
                {sending ? 'Envoi...' : 'Envoyer la demande'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Field({ label, type = 'text', value, onChange, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
      <label
        style={{
          fontSize: '0.6rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: '2px',
          padding: '0.7rem 0.85rem',
          color: 'white',
          fontFamily: 'var(--sans)',
          fontSize: '0.82rem',
          outline: 'none',
          width: '100%',
        }}
      />
    </div>
  )
}
