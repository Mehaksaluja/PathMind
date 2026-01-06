'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './Sidebar.module.css'

interface Resource {
  title: string
  url: string
  type: string
}

interface TopicData {
  id: string
  title: string
  description: string
  level: string
  estimatedHours?: number
  resources?: Resource[]
  children?: TopicData[]
}

interface SidebarProps {
  selectedTopic: TopicData | null
  selectedNodeId: string | null
  roadmapTitle?: string
  roadmapDescription?: string
  topicMap?: Record<string, TopicData>
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function Sidebar({ 
  selectedTopic, 
  selectedNodeId, 
  roadmapTitle,
  roadmapDescription,
  topicMap 
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isLoadingChat, setIsLoadingChat] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const getParentTopic = () => {
    if (!selectedTopic?.parentId || !topicMap) return null
    return Object.values(topicMap).find(t => t.nodeId === selectedTopic.parentId) || null
  }

  const getSiblingTopics = () => {
    if (!selectedTopic?.parentId || !topicMap) return []
    const parent = Object.values(topicMap).find(t => t.nodeId === selectedTopic.parentId)
    if (!parent?.children) return []
    return parent.children.filter(child => child.id !== selectedTopic.id)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim() || isLoadingChat) return

    const userMessage = chatInput.trim()
    setChatInput('')
    setChatMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoadingChat(true)

    try {
      const parentTopic = getParentTopic()
      const siblings = getSiblingTopics()
      
      let roadmapStructure = ''
      if (topicMap && selectedTopic) {
        const buildPath = (topic: TopicData, path: string[] = []): string[] => {
          const currentPath = [...path, topic.title]
          if (topic.parentId && topicMap) {
            const parent = Object.values(topicMap).find(t => t.nodeId === topic.parentId)
            if (parent) {
              return buildPath(parent, currentPath)
            }
          }
          return currentPath
        }
        const path = buildPath(selectedTopic).reverse()
        roadmapStructure = `Learning Path: ${path.join(' → ')}`
      }

      const token = localStorage.getItem('auth-token')
      if (!token) {
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: 'You must be logged in to use the chatbot.',
          },
        ])
        setIsLoadingChat(false)
        return
      }

      const response = await fetch('http://localhost:5000/api/chatbot/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: userMessage,
          context: {
            topicTitle: selectedTopic?.title,
            topicDescription: selectedTopic?.description,
            topicLevel: selectedTopic?.level,
            estimatedHours: selectedTopic?.estimatedHours,
            resources: selectedTopic?.resources,
            parentTopic: parentTopic?.title,
            subtopics: selectedTopic?.children || [],
            siblingTopics: siblings,
            roadmapTitle,
            roadmapDescription,
            roadmapStructure,
          },
        }),
      })

      const data = await response.json()

      if (response.ok && data.response) {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again later.',
        },
      ])
    } finally {
      setIsLoadingChat(false)
    }
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: '#10b981',
      intermediate: '#3b82f6',
      advanced: '#8b5cf6',
    }
    return colors[level] || '#6b7280'
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>AI Assistant</h2>
        {selectedTopic && (
          <div className={styles.tabSwitcher}>
            <button
              className={`${styles.tabButton} ${activeTab === 'details' ? styles.active : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'chat' ? styles.active : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>
        )}
      </div>

      <div className={styles.sidebarContent}>
        {selectedTopic ? (
          <>
            {activeTab === 'details' ? (
              <div className={styles.topicInfo}>
                <div className={styles.topicHeader}>
                  <h3 className={styles.topicTitle}>{selectedTopic.title}</h3>
                  {selectedTopic.level && (
                    <span
                      className={styles.levelBadge}
                      style={{ backgroundColor: `${getLevelColor(selectedTopic.level)}20`, color: getLevelColor(selectedTopic.level) }}
                    >
                      {selectedTopic.level}
                    </span>
                  )}
                </div>

                {selectedTopic.estimatedHours && (
                  <div className={styles.metaInfo}>
                    <span className={styles.metaItem}>
                      {selectedTopic.estimatedHours} hours
                    </span>
                  </div>
                )}

                <div className={styles.description}>
                  <h4>Description</h4>
                  <p>{selectedTopic.description}</p>
                </div>

                {selectedTopic.resources && selectedTopic.resources.length > 0 && (
                  <div className={styles.resources}>
                    <h4>Resources</h4>
                    <ul className={styles.resourceList}>
                      {selectedTopic.resources.map((resource, index) => (
                        <li key={index} className={styles.resourceItem}>
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.resourceLink}
                          >
                            <span className={styles.resourceIcon}>
                            </span>
                            <span className={styles.resourceTitle}>{resource.title}</span>
                            <span className={styles.externalIcon}>↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {getParentTopic() && (
                  <div className={styles.parentTopic}>
                    <h4>Parent Topic</h4>
                    <div 
                      className={styles.parentTopicLink}
                      onClick={() => {
                        const parent = getParentTopic()
                        if (parent?.nodeId && topicMap) {
                        }
                      }}
                    >
                      <span>← {getParentTopic()?.title}</span>
                    </div>
                  </div>
                )}

                {selectedTopic.children && selectedTopic.children.length > 0 && (
                  <div className={styles.subtopics}>
                    <h4>Subtopics ({selectedTopic.children.length})</h4>
                    <ul className={styles.subtopicList}>
                      {selectedTopic.children.map((child) => (
                        <li key={child.id} className={styles.subtopicItem}>
                          <div className={styles.subtopicHeader}>
                            <span className={styles.subtopicTitle}>{child.title}</span>
                            {child.level && (
                              <span
                                className={styles.subtopicLevel}
                                style={{ color: getLevelColor(child.level) }}
                              >
                                {child.level}
                              </span>
                            )}
                          </div>
                          {child.description && (
                            <p className={styles.subtopicDescription}>
                              {child.description.substring(0, 100)}
                              {child.description.length > 100 ? '...' : ''}
                            </p>
                          )}
                          {child.children && child.children.length > 0 && (
                            <div className={styles.subtopicChildren}>
                              <span className={styles.subtopicChildrenCount}>
                                {child.children.length} subtopic{child.children.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                  {chatMessages.length === 0 ? (
                    <div className={styles.chatEmpty}>
                      <p>Ask me anything about "{selectedTopic.title}"!</p>
                      <p className={styles.chatHint}>
                        I can explain concepts, clarify doubts, provide examples, and guide you through your learning journey.
                      </p>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div
                        key={index}
                        className={`${styles.chatMessage} ${styles[message.role]}`}
                      >
                        <div className={styles.messageContent}>{message.content}</div>
                      </div>
                    ))
                  )}
                  {isLoadingChat && (
                    <div className={`${styles.chatMessage} ${styles.assistant}`}>
                      <div className={styles.messageContent}>
                        <span className={styles.typingIndicator}>Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className={styles.chatForm}>
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask a question..."
                    className={styles.chatInput}
                    disabled={isLoadingChat}
                  />
                  <button
                    type="submit"
                    className={styles.chatSendButton}
                    disabled={isLoadingChat || !chatInput.trim()}
                  >
                    Send
                  </button>
                </form>
              </div>
            )}
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}></div>
            <p>Click on any topic in the roadmap to view details and chat with the AI assistant.</p>
          </div>
        )}
      </div>
    </aside>
  )
}