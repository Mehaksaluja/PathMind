'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoadmapFlow from '@/components/dashboard/RoadmapFlow'
import Sidebar from '@/components/dashboard/Sidebar'
import { getAuthToken, getCurrentUser, clearAuth } from '@/lib/auth'
import styles from './roadmap.module.css'

interface TopicData {
  id: string
  title: string
  description: string
  level: string
  estimatedHours?: number
  resources?: Array<{ title: string; url: string; type: string }>
  children?: TopicData[]
  nodeId?: string
  parentId?: string | null
}

export default function RoadmapPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roadmapData, setRoadmapData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
    }

    // Get roadmap data from localStorage or fetch from API
    const savedRoadmap = localStorage.getItem('currentRoadmap')
    if (savedRoadmap) {
      try {
        const parsed = JSON.parse(savedRoadmap)
        setRoadmapData(parsed)
      } catch (e) {
        console.error('Error parsing roadmap data:', e)
      }
    }
    setLoading(false)
  }, [])

  const handleBack = () => {
    router.push('/dashboard')
  }

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading roadmap...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!roadmapData) {
    return (
      <ProtectedRoute>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h2>No Roadmap Found</h2>
            <p>Please generate a roadmap first</p>
            <button onClick={handleBack} className={styles.backButton}>
              Go to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              <button onClick={handleBack} className={styles.backButton}>
                ← Back
              </button>
              <div className={styles.titleSection}>
                <h1 className={styles.title}>{roadmapData.title || 'Learning Roadmap'}</h1>
                {roadmapData.description && (
                  <p className={styles.description}>{roadmapData.description}</p>
                )}
              </div>
            </div>
            <div className={styles.headerActions}>
              {user && (
                <div className={styles.userInfo}>
                  <div className={styles.userAvatar}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.name}</span>
                </div>
              )}
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.roadmapWrapper}>
            <RoadmapFlow 
              onTopicSelect={(topicId, nodeId) => {
                // Find topic from roadmapData recursively
                const findTopic = (topics: TopicData[], targetId: string): TopicData | null => {
                  if (!topics) return null
                  
                  for (const topic of topics) {
                    if (topic.id === targetId) {
                      return topic
                    }
                    if (topic.children && topic.children.length > 0) {
                      const found = findTopic(topic.children, targetId)
                      if (found) return found
                    }
                  }
                  return null
                }

                if (roadmapData?.topics && topicId) {
                  const topic = findTopic(roadmapData.topics, topicId)
                  if (topic) {
                    // Add nodeId to topic for sidebar compatibility
                    const topicWithNodeId = { ...topic, nodeId: nodeId || topicId }
                    setSelectedTopic(topicWithNodeId)
                    setSelectedNodeId(nodeId || topicId)
                  } else {
                    setSelectedTopic(null)
                    setSelectedNodeId(null)
                  }
                } else {
                  setSelectedTopic(null)
                  setSelectedNodeId(null)
                }
              }}
              roadmapData={roadmapData}
            />
          </div>
          <Sidebar 
            selectedTopic={selectedTopic}
            selectedNodeId={selectedNodeId}
            roadmapTitle={roadmapData?.title}
            roadmapDescription={roadmapData?.description}
            topicMap={roadmapData?.topicMap}
          />
        </main>
      </div>
    </ProtectedRoute>
  )
}
