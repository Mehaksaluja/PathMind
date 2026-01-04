'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoadmapFlow from '@/components/dashboard/RoadmapFlow'
import Sidebar from '@/components/dashboard/Sidebar'
import styles from './dashboard.module.css'

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>PathMind</h1>
          <p className={styles.subtitle}>AI-Powered Learning Roadmap Generator</p>
        </header>
        
        <main className={styles.main}>
          <div className={styles.roadmapContainer}>
            <RoadmapFlow onTopicSelect={setSelectedTopic} />
          </div>
          
          <Sidebar selectedTopic={selectedTopic} />
        </main>
      </div>
    </ProtectedRoute>
  )
}

