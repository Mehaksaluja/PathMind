'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContent}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🧠</span>
          <span className={styles.logoText}>
            <span className={styles.logoGlow}>Path</span>
            <span className={styles.logoMind}>Mind</span>
          </span>
        </Link>

        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/how-it-works" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            How It Works
          </Link>
          <Link href="/login" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
            Sign In
          </Link>
          <Link href="/signup" className={styles.navButton} onClick={() => setMobileMenuOpen(false)}>
            <span>Get Started</span>
            <span className={styles.buttonShine}></span>
          </Link>
        </div>

        <button 
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={mobileMenuOpen ? styles.open : ''}></span>
          <span className={mobileMenuOpen ? styles.open : ''}></span>
          <span className={mobileMenuOpen ? styles.open : ''}></span>
        </button>
      </div>
    </nav>
  )
}

