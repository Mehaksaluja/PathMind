'use client'

import Link from 'next/link'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>
      <div className={styles.heroContent}>
        <div className={styles.heroTitleWrapper}>
          <h1 className={styles.heroTitle}>
            <span className={styles.titleLine1}>Learn Smarter,</span>
            <span className={styles.titleLine2}>Not Harder</span>
          </h1>
          <div className={styles.titleUnderline}></div>
        </div>
        <p className={styles.heroSubtitle}>
          PathMind creates personalized AI-powered learning roadmaps that show you
          <strong className={styles.highlight}> what to learn, in what order, and why</strong>. 
          No more random tutorials.
        </p>
        <div className={styles.heroButtons}>
          <Link href="/signup" className={styles.primaryButton}>
            <span>Start Learning Free</span>
            <span className={styles.buttonShine}></span>
          </Link>
          <Link href="/login" className={styles.secondaryButton}>
            Sign In
          </Link>
        </div>
      </div>
    </section>
  )
}

