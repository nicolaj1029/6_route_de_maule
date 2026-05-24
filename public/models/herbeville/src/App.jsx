import { Suspense, lazy, useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import MapSection from './components/MapSection.jsx'
import LotConfigurator from './components/LotConfigurator.jsx'
import ContactForm from './components/ContactForm.jsx'
import Footer from './components/Footer.jsx'

const AiDesignAssistant = lazy(() => import('./components/AiDesignAssistant.jsx'))
const PipelineDocs = lazy(() => import('./components/PipelineDocs.jsx'))

export default function App() {
  // Lift config state so Nav/Hero CTAs can scroll and AI can update configurator
  const [config, setConfig] = useState({
    house: 'moderne',
    roof:  'tuile',
    garden: ['lavande', 'piscine'],
    mood:  'famille',
  })

  return (
    <>
      <Nav />
      <Hero />
      <MapSection />
      <LotConfigurator config={config} setConfig={setConfig} />
      <Suspense fallback={null}>
        <AiDesignAssistant config={config} setConfig={setConfig} />
      </Suspense>
      <ContactForm config={config} />
      <Suspense fallback={null}>
        <PipelineDocs />
      </Suspense>
      <Footer />
    </>
  )
}
