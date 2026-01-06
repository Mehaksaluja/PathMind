'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RoadmapFlow from '@/components/dashboard/RoadmapFlow'
import Sidebar from '@/components/dashboard/Sidebar'
import { getCurrentUser, clearAuth } from '@/lib/auth'
import styles from './dashboard.module.css'

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
  depth?: number
}

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState<TopicData | null>(null)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [showWelcome, setShowWelcome] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [roadmapData, setRoadmapData] = useState<{
    title?: string
    description?: string
    flowData?: { nodes: any[]; edges: any[] }
    topicMap?: Record<string, TopicData>
  } | null>(null)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Hide welcome message after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcome(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{ x: number; y: number; radius: number; vx: number; vy: number; opacity: number }> = []

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
      })
    }

    let animationFrame: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(10, 10, 20, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(138, 43, 226, ${particle.opacity})`
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleLogout = () => {
    clearAuth()
    router.push('/')
  }

  const handleGenerateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch('http://localhost:5000/api/roadmaps/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()
      
      if (response.ok && data.roadmap) {
        console.log('Roadmap received:', data.roadmap)
        setRoadmapData(data.roadmap)
        setShowWelcome(false)
      } else {
        console.error('Error response:', data)
        alert(data.error || 'Failed to generate roadmap. Please try again.')
      }
    } catch (error) {
      console.error('Error generating roadmap:', error)
      alert('Failed to connect to server. Please make sure the backend is running.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateMockRoadmap = (userPrompt: string) => {
    // This is a placeholder - will be replaced with actual AI generation
    const keywords = userPrompt.toLowerCase()
    let nodes: any[] = []
    let edges: any[] = []

    if (keywords.includes('react') || keywords.includes('frontend')) {
      nodes = [
        { id: '1', data: { label: 'HTML & CSS Basics' }, position: { x: 250, y: 50 } },
        { id: '2', data: { label: 'JavaScript Fundamentals' }, position: { x: 250, y: 150 } },
        { id: '3', data: { label: 'React Basics' }, position: { x: 250, y: 250 } },
        { id: '4', data: { label: 'React Hooks' }, position: { x: 100, y: 350 } },
        { id: '5', data: { label: 'State Management' }, position: { x: 250, y: 350 } },
        { id: '6', data: { label: 'Advanced React' }, position: { x: 400, y: 350 } },
      ]
      edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e3-5', source: '3', target: '5' },
        { id: 'e3-6', source: '3', target: '6' },
      ]
    } else if (keywords.includes('python') || keywords.includes('backend')) {
      nodes = [
        { id: '1', data: { label: 'Python Basics' }, position: { x: 250, y: 50 } },
        { id: '2', data: { label: 'Data Structures' }, position: { x: 250, y: 150 } },
        { id: '3', data: { label: 'OOP in Python' }, position: { x: 250, y: 250 } },
        { id: '4', data: { label: 'Web Frameworks' }, position: { x: 100, y: 350 } },
        { id: '5', data: { label: 'Database Integration' }, position: { x: 250, y: 350 } },
        { id: '6', data: { label: 'API Development' }, position: { x: 400, y: 350 } },
      ]
      edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e3-5', source: '3', target: '5' },
        { id: 'e3-6', source: '3', target: '6' },
      ]
    } else {
      // Generic roadmap
      nodes = [
        { id: '1', data: { label: 'Foundation Concepts' }, position: { x: 250, y: 50 } },
        { id: '2', data: { label: 'Core Skills' }, position: { x: 250, y: 150 } },
        { id: '3', data: { label: 'Intermediate Level' }, position: { x: 250, y: 250 } },
        { id: '4', data: { label: 'Advanced Topics' }, position: { x: 100, y: 350 } },
        { id: '5', data: { label: 'Specialization' }, position: { x: 250, y: 350 } },
        { id: '6', data: { label: 'Mastery' }, position: { x: 400, y: 350 } },
      ]
      edges = [
        { id: 'e1-2', source: '1', target: '2' },
        { id: 'e2-3', source: '2', target: '3' },
        { id: 'e3-4', source: '3', target: '4' },
        { id: 'e3-5', source: '3', target: '5' },
        { id: 'e3-6', source: '3', target: '6' },
      ]
    }

    return { nodes, edges }
  }

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <canvas ref={canvasRef} className={styles.canvas} />
        
        <div className={styles.background}>
          <div className={styles.gradientOrb1}></div>
          <div className={styles.gradientOrb2}></div>
          <div className={styles.gradientOrb3}></div>
        </div>

        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.title}>PathMind</h1>
              <p className={styles.subtitle}>AI-Powered Learning Roadmap Generator</p>
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
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {showWelcome && user && !roadmapData && (
          <div className={styles.welcomeBanner}>
            <div className={styles.welcomeContent}>
              <h2 className={styles.welcomeTitle}>
                Welcome{user.name ? `, ${user.name}` : ''}!
              </h2>
              <p className={styles.welcomeText}>
                Enter your learning goal below to generate your personalized roadmap.
              </p>
            </div>
            <button 
              className={styles.closeWelcome}
              onClick={() => setShowWelcome(false)}
              aria-label="Close welcome message"
            >
              ×
            </button>
          </div>
        )}

        {!roadmapData && (
          <div className={styles.promptSection}>
            <div className={styles.promptCard}>
              <div className={styles.promptHeader}>
                <h2 className={styles.promptTitle}>Create Your Learning Roadmap</h2>
                <p className={styles.promptSubtitle}>
                  Tell us what you want to learn, and we'll generate a personalized roadmap for you
                </p>
              </div>
              
              <form onSubmit={handleGenerateRoadmap} className={styles.promptForm}>
                <div className={styles.inputWrapper}>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., I want to learn React and build a full-stack web application..."
                    className={styles.promptInput}
                    rows={4}
                    disabled={isGenerating}
                    required
                  />
                  <span className={styles.inputFocus}></span>
                </div>
                
                <button 
                  type="submit" 
                  className={styles.generateButton}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <span className={styles.spinner}></span>
                      <span>Generating Roadmap...</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Generate Roadmap</span>
                      <span className={styles.buttonShine}></span>
                    </>
                  )}
                </button>
              </form>

              <div className={styles.examples}>
                <p className={styles.examplesTitle}>Examples:</p>
                <div className={styles.exampleTags}>
                  <button 
                    className={styles.exampleTag}
                    onClick={() => setPrompt('I want to learn React from scratch and build modern web applications')}
                    disabled={isGenerating}
                  >
                    Learn React
                  </button>
                  <button 
                    className={styles.exampleTag}
                    onClick={() => setPrompt('I want to master Python for data science and machine learning')}
                    disabled={isGenerating}
                  >
                    Python Data Science
                  </button>
                  <button 
                    className={styles.exampleTag}
                    onClick={() => setPrompt('I want to become a full-stack developer with Node.js and React')}
                    disabled={isGenerating}
                  >
                    Full-Stack Development
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <main className={styles.main}>
          {roadmapData ? (
            <>
              <div className={styles.roadmapContainer}>
                <div className={styles.roadmapHeader}>
                  <h3 className={styles.roadmapTitle}>
                    {roadmapData?.title || 'Your Learning Roadmap'}
                  </h3>
                  <button 
                    onClick={() => {
                      setRoadmapData(null)
                      setPrompt('')
                      setSelectedTopic(null)
                      setSelectedNodeId(null)
                    }}
                    className={styles.newRoadmapButton}
                  >
                    Create New Roadmap
                  </button>
                </div>
                <RoadmapFlow 
                  onTopicSelect={(topicId, nodeId) => {
                    if (nodeId && roadmapData?.topicMap) {
                      const topic = roadmapData.topicMap[nodeId]
                      setSelectedTopic(topic || null)
                      setSelectedNodeId(nodeId)
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
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateContent}>
                <div className={styles.emptyStateIcon}></div>
                <h3 className={styles.emptyStateTitle}>No Roadmap Yet</h3>
                <p className={styles.emptyStateText}>
                  Enter your learning goal above to generate your personalized roadmap
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}

