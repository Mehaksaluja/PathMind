'use client'

import Link from 'next/link'
import styles from './CTA.module.css'

export default function CTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaBackground}>
        <div className={styles.ctaGradientOrb1}></div>
        <div className={styles.ctaGradientOrb2}></div>
        <div className={styles.ctaGradientOrb3}></div>
      </div>
      <div className={styles.ctaContent}>
        <div className={styles.ctaIcon}>🚀</div>
        <h2 className={styles.ctaTitle}>
          Ready to Start Your Learning Journey?
        </h2>
        <p className={styles.ctaSubtitle}>
          Join thousands of learners who are already using PathMind to accelerate their growth. 
          Discover the most efficient path to your goals today.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/signup" className={styles.ctaButton}>
            <span>Get Started Free</span>
            <span className={styles.buttonShine}></span>
          </Link>
          <Link href="/login" className={styles.ctaSecondaryButton}>
            Sign In
          </Link>
        </div>
        <div className={styles.ctaFeatures}>
          <div className={styles.ctaFeature}>
            <span className={styles.ctaFeatureIcon}>✓</span>
            <span>No credit card required</span>
          </div>
          <div className={styles.ctaFeature}>
            <span className={styles.ctaFeatureIcon}>✓</span>
            <span>Free forever plan</span>
          </div>
          <div className={styles.ctaFeature}>
            <span className={styles.ctaFeatureIcon}>✓</span>
            <span>Start in seconds</span>
          </div>
        </div>
      </div>
    </section>
  )
}

