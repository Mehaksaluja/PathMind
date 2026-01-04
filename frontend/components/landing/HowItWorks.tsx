'use client'

import Link from 'next/link'
import Navbar from '../layout/Navbar'
import Footer from '../layout/Footer'
import styles from './HowItWorks.module.css'

const steps = [
  {
    number: '01',
    title: 'Set Your Learning Goal',
    description: 'Tell PathMind what you want to achieve - whether it\'s getting a job, building a project, or mastering a skill. Our AI understands your objectives and creates a tailored learning path.',
    icon: '🎯',
  },
  {
    number: '02',
    title: 'AI Generates Your Roadmap',
    description: 'Our advanced AI analyzes your goal and creates a personalized learning roadmap with topics organized by dependencies and logical progression.',
    icon: '🤖',
  },
  {
    number: '03',
    title: 'Visualize Your Path',
    description: 'Explore your roadmap as an interactive flowchart. See how topics connect, which ones depend on others, and understand the learning sequence.',
    icon: '🗺️',
  },
  {
    number: '04',
    title: 'Learn with Context',
    description: 'Click on any topic to access curated resources, documentation, and videos. Get AI-powered explanations about why each topic matters.',
    icon: '💡',
  },
  {
    number: '05',
    title: 'Track Your Progress',
    description: 'Mark topics as complete, see your learning journey, and adjust your roadmap as you progress. Stay motivated with visual progress tracking.',
    icon: '📊',
  }
]

export default function HowItWorks() {
  return (
    <div className={styles.container}>
      <Navbar />
      
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>How It Works</div>
          <h1 className={styles.heroTitle}>Your Learning Journey in 5 Simple Steps</h1>
          <p className={styles.heroSubtitle}>
            PathMind transforms how you learn by providing structured, AI-powered roadmaps 
            that guide you from goal to mastery.
          </p>
        </div>
      </div>

      <div className={styles.stepsSection}>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div key={index} className={styles.stepWrapper}>
              <div className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <div className={styles.stepNumber}>{step.number}</div>
                  <div className={styles.stepIcon}>{step.icon}</div>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDescription}>{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={styles.stepConnector}>
                  <div className={styles.connectorLine}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Learning?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of learners who are already using PathMind to accelerate their growth.
          </p>
          <div className={styles.ctaButtons}>
            <Link href="/signup" className={styles.ctaButton}>
              Get Started Free
            </Link>
            <Link href="/login" className={styles.ctaSecondaryButton}>
              Sign In
            </Link>
          </div>
          <div className={styles.backToHome}>
            <Link href="/" className={styles.homeLink}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
