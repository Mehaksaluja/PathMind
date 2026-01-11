'use client'

import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import styles from './RoadmapFlow.module.css'

interface TopicData {
  id: string
  title: string
  description: string
  level: string
  estimatedHours?: number
  resources?: Array<{ title: string; url: string; type: string }>
  children?: TopicData[]
}

interface RoadmapFlowProps {
  onTopicSelect: (topicId: string | null, nodeId: string | null) => void
  roadmapData?: {
    title?: string
    description?: string
    topics?: TopicData[]
    topicMap?: Record<string, any>
    flowData?: { nodes: any[]; edges: any[] }
  } | null
}

const TopicCard = ({
  topic,
  level = 0,
  isExpanded,
  onToggle,
  onSelect,
  selectedTopicId,
  expandedTopics,
  setExpandedTopics,
}: {
  topic: TopicData
  level: number
  isExpanded: boolean
  onToggle: () => void
  onSelect: () => void
  selectedTopicId: string | null
  expandedTopics: Set<string>
  setExpandedTopics: Dispatch<SetStateAction<Set<string>>>
}) => {
  const levelColors: Record<string, string> = {
    beginner: '#10b981',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6',
  }

  const levelColor = levelColors[topic.level] || '#6b7280'
  const hasChildren = topic.children && topic.children.length > 0
  const isSelected = selectedTopicId === topic.id

  return (
    <div className={styles.topicCard}>
      <div
        className={`${styles.topicHeader} ${isSelected ? styles.selected : ''}`}
        style={{
          borderLeft: `4px solid ${levelColor}`,
          marginLeft: level > 0 ? `${level * 24}px` : '0',
        }}
        onClick={() => {
          onSelect()
          if (hasChildren) {
            onToggle()
          }
        }}
      >
        <div className={styles.topicHeaderContent}>
          <div className={styles.topicTitleRow}>
            <h4 className={styles.topicTitle}>{topic.title}</h4>
            {hasChildren && (
              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle()
                }}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? '▼' : '▶'}
              </button>
            )}
          </div>
          <div className={styles.topicMeta}>
            <span
              className={styles.levelBadge}
              style={{
                backgroundColor: `${levelColor}20`,
                color: levelColor,
                borderColor: `${levelColor}40`,
              }}
            >
              {topic.level}
            </span>
            {topic.estimatedHours && (
              <span className={styles.hoursBadge}>{topic.estimatedHours}h</span>
            )}
            {hasChildren && (
              <span className={styles.childrenCount}>
                {topic.children?.length} subtopics
              </span>
            )}
          </div>
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className={styles.topicChildren}>
          {topic.children?.map((child) => (
            <TopicCard
              key={child.id}
              topic={child}
              level={level + 1}
              isExpanded={expandedTopics.has(child.id)}
              onToggle={() => {
                setExpandedTopics((prev) => {
                  const newSet = new Set(prev)
                  if (newSet.has(child.id)) {
                    newSet.delete(child.id)
                  } else {
                    newSet.add(child.id)
                  }
                  return newSet
                })
              }}
              onSelect={onSelect}
              selectedTopicId={selectedTopicId}
              expandedTopics={expandedTopics}
              setExpandedTopics={setExpandedTopics}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function RoadmapFlow({ onTopicSelect, roadmapData }: RoadmapFlowProps) {
  // Initialize: expand root topics by default
  const rootTopicIds = roadmapData?.topics?.map((t) => t.id) || []
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(
    new Set(rootTopicIds)
  )
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)

  const handleToggle = useCallback((topicId: string) => {
    setExpandedTopics((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }, [])

  const handleSelect = useCallback(
    (topic: TopicData) => {
      setSelectedTopicId(topic.id)
      // Find the nodeId from topicMap if available
      let nodeId = topic.id
      if (roadmapData?.topicMap) {
        const found = Object.entries(roadmapData.topicMap).find(
          ([_, data]: [string, any]) => data.id === topic.id
        )
        if (found) {
          nodeId = found[0]
        }
      }
      onTopicSelect(topic.id, nodeId)
    },
    [onTopicSelect, roadmapData]
  )

  if (!roadmapData?.topics || roadmapData.topics.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No roadmap data available</p>
      </div>
    )
  }

  return (
    <div className={styles.roadmapContainer}>
      <div className={styles.roadmapContent}>
        {roadmapData.topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            level={0}
            isExpanded={expandedTopics.has(topic.id)}
            onToggle={() => handleToggle(topic.id)}
            onSelect={() => handleSelect(topic)}
            selectedTopicId={selectedTopicId}
            expandedTopics={expandedTopics}
            setExpandedTopics={setExpandedTopics}
          />
        ))}
      </div>
    </div>
  )
}
