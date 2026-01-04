'use client'

import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoIcon}>🧠</span>
              <span className={styles.footerLogoText}>
                <span className={styles.footerLogoGlow}>Path</span>
                <span className={styles.footerLogoMind}>Mind</span>
              </span>
            </div>
            <p className={styles.footerTagline}>
              Learn smarter, not harder. Your AI-powered learning companion.
            </p>
          </div>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Product</h4>
              <Link href="/#features" className={styles.footerLink}>Features</Link>
              <Link href="/how-it-works" className={styles.footerLink}>How It Works</Link>
              <Link href="/pricing" className={styles.footerLink}>Pricing</Link>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Company</h4>
              <Link href="/about" className={styles.footerLink}>About</Link>
              <Link href="/blog" className={styles.footerLink}>Blog</Link>
              <Link href="/contact" className={styles.footerLink}>Contact</Link>
            </div>
            
            <div className={styles.footerColumn}>
              <h4 className={styles.footerColumnTitle}>Legal</h4>
              <Link href="/privacy" className={styles.footerLink}>Privacy</Link>
              <Link href="/terms" className={styles.footerLink}>Terms</Link>
              <Link href="/cookies" className={styles.footerLink}>Cookies</Link>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.footerCopyright}>
            &copy; 2024 PathMind. All rights reserved.
          </p>
          <div className={styles.footerSocial}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">🐦</a>
            <a href="#" className={styles.socialLink} aria-label="GitHub">💻</a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">💼</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

