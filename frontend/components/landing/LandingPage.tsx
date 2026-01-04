'use client'

import AnimatedBackground from './AnimatedBackground'
import Navbar from '../layout/Navbar'
import Hero from './Hero'
import Features from './Features'
import CTA from './CTA'
import Footer from '../layout/Footer'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <AnimatedBackground />
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </div>
  )
}

