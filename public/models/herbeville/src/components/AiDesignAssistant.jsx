import { useState } from 'react'
import styles from './AiDesignAssistant.module.css'

const EXAMPLES = [
  { label: 'Maison provencale lumineuse', prompt: 'Une maison lumineuse avec grande terrasse et jardin provencal, lavande et oliviers' },
  { label: 'Villa piscine contemporaine', prompt: 'Villa contemporaine avec piscine, toit plat et grandes baies vitrees' },
  { label: 'Chalet bois ecologique', prompt: 'Chalet en bois ecologique pour famille avec enfants, prairie naturelle' },
  { label: 'Bungalow minimaliste', prompt: 'Bungalow plain-pied minimaliste avec pergola et prairie naturelle' },
]

export default function AiDesignAssistant({ setConfig }) {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const fillPrompt = (text) => {
    setPrompt(text)
    runAI(text)
  }

  const runAI = async (inputOverride) => {
    const input = (inputOverride ?? prompt).trim()
    if (!input) return

    setLoading(true)
    setResponse(null)

    try {
      const endpoint = new URL('../api/design-assistant', window.location.href)
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      const data = await res.json()

      if (data?.config) {
        setConfig((current) => ({
          ...current,
          house: data.config.house || current.house,
          roof: data.config.roof || current.roof,
          garden: Array.isArray(data.config.garden) && data.config.garden.length > 0 ? data.config.garden : current.garden,
          mood: data.config.mood || current.mood,
        }))
      }

      setResponse({
        desc: data?.desc ?? '',
        blender: data?.blender ?? '',
        tags: data?.tags ?? [],
        source: data?.source ?? '',
      })
    } catch {
      setResponse({ error: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.section}>
      <span className="section-label">Intelligence artificielle</span>
      <h2 className="section-title">Decrivez votre<br />maison de reve</h2>
      <p className="section-body">
        L&apos;assistant traduit votre vision en configuration concrete sans exposer
        de cle API dans le navigateur, puis genere un prompt Blender exploitable.
      </p>

      <div className={styles.box}>
        <div className={styles.boxHeader}>
          <div className={styles.dot} />
          <span className={styles.boxTitle}>Assistant de conception · Herbeville</span>
        </div>
        <div className={styles.boxBody}>
          <div className={styles.chips}>
            {EXAMPLES.map((example) => (
              <button key={example.label} className={styles.chip} onClick={() => fillPrompt(example.prompt)}>
                {example.label}
              </button>
            ))}
          </div>

          <div className={styles.inputRow}>
            <input
              className={styles.input}
              type="text"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && runAI()}
              placeholder="Decrivez votre maison ideale sur ce terrain..."
            />
            <button className={styles.send} onClick={() => runAI()} disabled={loading}>
              {loading ? '...' : 'Analyser ->'}
            </button>
          </div>

          {loading && (
            <div className={styles.responseBox}>
              <em style={{ color: 'var(--muted)', fontSize: '0.82rem' }}>Analyse en cours...</em>
            </div>
          )}

          {response && !response.error && (
            <div className={styles.responseBox}>
              {response.desc && <p className={styles.desc}>{response.desc}</p>}
              {response.tags.length > 0 && (
                <div className={styles.tags}>
                  {response.tags.map((tag, index) => <span key={index} className={styles.tag}>{tag}</span>)}
                </div>
              )}
              {response.blender && (
                <pre className={styles.blenderPrompt}>{response.blender}</pre>
              )}
              {response.source && (
                <p className={styles.meta}>Source: {response.source}</p>
              )}
            </div>
          )}

          {response?.error && (
            <div className={styles.responseBox}>
              <p style={{ color: 'var(--terracotta)', fontSize: '0.82rem' }}>
                Erreur de connexion. Verifiez la route Cake `/api/design-assistant`.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
