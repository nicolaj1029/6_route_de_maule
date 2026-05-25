import { useState } from 'react'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import ParcelsSection from './components/ParcelsSection.jsx'
import AccessSection from './components/AccessSection.jsx'
import Configurateur from './components/Configurateur.jsx'
import AiAssistant from './components/AiAssistant.jsx'
import ContactSection from './components/ContactSection.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [config, setConfig] = useState({ house: 'normande', parcelId: 'A', garden: [] })

  return (
    <>
      <Nav />
      <Hero />
      <ParcelsSection setConfig={setConfig} />
      <AccessSection />
      <Configurateur config={config} setConfig={setConfig} />
      <AiAssistant setConfig={setConfig} />
      <ContactSection config={config} />
      <Footer />
    </>
  )
}
