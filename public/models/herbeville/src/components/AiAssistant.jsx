import { useState } from 'react'
import { inferDesignAssistantConfig } from '../config/designAssistantFallback.js'
import s from './AiAssistant.module.css'

const PROMPTS = [
  'Une villa lumineuse avec piscine et jardin mediterraneen',
  'Maison normande traditionnelle avec grand potager',
  'Bungalow ecologique de plain-pied dans une prairie naturelle',
  'Architecture contemporaine, vue degagee, terrasse et jardin structure',
]

function mapHouse(value) {
  return {
    moderne: 'villa',
    normand: 'normande',
    bois: 'bois',
    bungalow: 'bungalow',
  }[value] ?? 'normande'
}

export default function AiAssistant({ setConfig }) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const run = async (text) => {
    const prompt = (text ?? input).trim()
    if (!prompt) return

    setLoading(true)
    setResult(null)

    try {
      const endpoint = new URL('../api/design-assistant', window.location.href)
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!res.ok) {
        throw new Error('Request failed')
      }

      const data = await res.json()
      const house = mapHouse(data?.config?.house)

      setConfig((current) => ({ ...current, house }))
      setResult({
        vision: data?.desc ?? '',
        style: house,
        tags: data?.tags ?? [],
        blender: data?.blender ?? '',
        source: data?.source ?? '',
      })
    } catch {
      const fallback = inferDesignAssistantConfig(prompt)
      const house = mapHouse(fallback.config.house)

      setConfig((current) => ({ ...current, house }))
      setResult({
        vision: fallback.desc,
        style: house,
        tags: fallback.tags ?? [],
        blender: fallback.blender ?? '',
        source: fallback.source ?? '',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`section section--parchment ${s.section}`}>
      <div className="container">
        <div className={s.layout}>
          <div className={s.left}>
            <p className="t-label">Intelligence artificielle</p>
            <h2 className={`t-heading ${s.heading}`}>
              Decrivez votre
              <br />
              projet ideal
            </h2>
            <p className="t-body" style={{ marginTop: '0.8rem' }}>
              L&apos;assistant traduit votre intention en orientation de projet et produit une base de prompt
              Blender exploitable, sans exposer de cle API dans le navigateur.
            </p>
          </div>

          <div className={s.right}>
            <div className={s.box}>
              <div className={s.chips}>
                {PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    className={s.chip}
                    onClick={() => {
                      setInput(prompt)
                      run(prompt)
                    }}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className={s.inputRow}>
                <input
                  className={s.input}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && run()}
                  placeholder="Ex: maison en pierre avec vue sur les champs..."
                />
                <button className={s.send} onClick={() => run()} disabled={loading} type="button">
                  {loading ? '...' : 'Envoyer'}
                </button>
              </div>

              {result && (
                <div className={s.result}>
                  {result.vision && <p className={s.vision}>{result.vision}</p>}
                  <div className={s.tags}>
                    {result.style && <span className={s.tag}>{result.style}</span>}
                    {result.tags.map((tag) => (
                      <span key={tag} className={s.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  {result.blender && (
                    <div className={s.blenderPrompt}>
                      <span className={s.blenderIcon}>Prompt</span>
                      <code>{result.blender}</code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
