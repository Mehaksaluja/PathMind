'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import styles from './RoadmapFlowchart.module.css'

interface TopicData {
  id: string
  title: string
  description: string
  level: string
  estimatedHours?: number
  resources?: Array<{ title: string; url: string; type: string }>
  children?: TopicData[]
}

interface RoadmapFlowchartProps {
  roadmapData: {
    title?: string
    description?: string
    topics?: TopicData[]
    topicMap?: Record<string, any>
  }
}

const FlowchartNode = ({
  topic,
  level,
  position,
  isExpanded,
  onToggle,
  onSelect,
  isSelected,
}: {
  topic: TopicData
  level: number
  position: { x: number; y: number }
  isExpanded: boolean
  onToggle: () => void
  onSelect: () => void
  isSelected: boolean
}) => {
  const levelColors: Record<string, string> = {
    beginner: '#10b981',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6',
  }

  const levelColor = levelColors[topic.level] || '#6b7280'
  const hasChildren = topic.children && topic.children.length > 0

  return (
    <div
      className={`${styles.node} ${isSelected ? styles.selected : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        borderColor: levelColor,
      }}
      onClick={onSelect}
    >
      <div className={styles.nodeContent}>
        <div className={styles.nodeHeader}>
          <h3 className={styles.nodeTitle}>{topic.title}</h3>
          {hasChildren && (
            <button
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
        </div>
        <div className={styles.nodeMeta}>
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
        </div>
      </div>
      {hasChildren && (
        <div className={styles.nodeConnector} style={{ borderColor: levelColor }}></div>
      )}
    </div>
  )
}

export default function RoadmapFlowchart({ roadmapData }: RoadmapFlowchartProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)

  // Initialize: expand root nodes
  const rootTopicIds = useMemo(() => {
    return roadmapData?.topics?.map((t) => t.id) || []
  }, [roadmapData])

  useEffect(() => {
    if (rootTopicIds.length > 0 && expandedNodes.size === 0) {
      setExpandedNodes(new Set(rootTopicIds))
    }
  }, [rootTopicIds, expandedNodes.size])

  // Calculate positions for flowchart layout - FIXED VERSION
  const { nodePositions, containerSize } = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {}
    const HORIZONTAL_SPACING = 300
    const VERTICAL_SPACING = 200
    const START_X = 100
    const START_Y = 80

    let maxX = START_X
    let maxY = START_Y

    // Step 1: Collect ALL visible nodes with their hierarchy info
    const nodeList: Array<{
      topic: TopicData
      level: number
      parentId?: string
    }> = []

    const collectNodes = (topic: TopicData, level: number, parentId?: string) => {
      // Always add root nodes, add children only if parent is expanded
      if (level === 0 || (parentId && expandedNodes.has(parentId))) {
        nodeList.push({ topic, level, parentId })
        
        // If this node is expanded, collect its children
        if (expandedNodes.has(topic.id) && topic.children) {
          topic.children.forEach((child) => {
            collectNodes(child, level + 1, topic.id)
          })
        }
      }
    }

    roadmapData?.topics?.forEach((topic) => {
      collectNodes(topic, 0)
    })

    // Step 2: Position ALL nodes level by level
    let currentY = START_Y
    
    // Position root nodes (level 0)
    const rootNodes = nodeList.filter((n) => n.level === 0)
    rootNodes.forEach(({ topic }) => {
      positions[topic.id] = { x: START_X, y: currentY }
      maxX = Math.max(maxX, START_X + 220)
      maxY = Math.max(maxY, currentY + 120)
      currentY += VERTICAL_SPACING
    })

    // Position child nodes level by level
    let maxLevel = Math.max(...nodeList.map((n) => n.level), 0)
    
    for (let level = 1; level <= maxLevel; level++) {
      const levelNodes = nodeList.filter((n) => n.level === level)
      
      // Group by parent
      const nodesByParent = new Map<string, typeof levelNodes>()
      levelNodes.forEach((node) => {
        if (node.parentId) {
          if (!nodesByParent.has(node.parentId)) {
            nodesByParent.set(node.parentId, [])
          }
          nodesByParent.get(node.parentId)!.push(node)
        }
      })

      // Position each group
      nodesByParent.forEach((siblings, parentId) => {
        if (!positions[parentId]) return

        const parentPos = positions[parentId]
        const x = parentPos.x + HORIZONTAL_SPACING
        
        siblings.forEach(({ topic }, index) => {
          const y = parentPos.y + (index * VERTICAL_SPACING)
          positions[topic.id] = { x, y }
          maxX = Math.max(maxX, x + 220)
          maxY = Math.max(maxY, y + 120)
        })
      })
    }

    // Step 4: Ensure container is large enough
    return {
      nodePositions: positions,
      containerSize: {
        width: Math.max(maxX + 400, 2000),
        height: Math.max(maxY + 400, 2000),
      },
    }
  }, [roadmapData, expandedNodes])

  const handleToggle = useCallback((topicId: string) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(topicId)) {
        newSet.delete(topicId)
      } else {
        newSet.add(topicId)
      }
      return newSet
    })
  }, [])

  const handleSelect = useCallback((topicId: string) => {
    setSelectedNodeId(topicId)
  }, [])

  // Render connections
  const connections = useMemo(() => {
    const conns: Array<{ start: { x: number; y: number }; end: { x: number; y: number }; key: string }> = []

    const processTopic = (topic: TopicData, parentId?: string, level: number = 0) => {
      const nodeId = topic.id
      
      if (!expandedNodes.has(nodeId) && level > 0) {
        return
      }

      if (parentId && nodePositions[parentId] && nodePositions[nodeId]) {
        conns.push({
          start: nodePositions[parentId],
          end: nodePositions[nodeId],
          key: `connection-${parentId}-${nodeId}`,
        })
      }

      if (expandedNodes.has(nodeId) && topic.children) {
        topic.children.forEach((child) => {
          processTopic(child, nodeId, level + 1)
        })
      }
    }

    roadmapData?.topics?.forEach((topic) => {
      processTopic(topic)
    })

    return conns
  }, [roadmapData, expandedNodes, nodePositions])

  const nodes = useMemo(() => {
    const nodeList: JSX.Element[] = []

    // Render all nodes that have positions
    Object.entries(nodePositions).forEach(([nodeId, position]) => {
      // Find the topic data
      const findTopic = (topics: TopicData[]): TopicData | null => {
        for (const topic of topics) {
          if (topic.id === nodeId) return topic
          if (topic.children) {
            const found = findTopic(topic.children)
            if (found) return found
          }
        }
        return null
      }

      const topic = roadmapData?.topics ? findTopic(roadmapData.topics) : null
      if (!topic) return

      const isExpanded = expandedNodes.has(topic.id)
      const isSelected = selectedNodeId === topic.id
      const topicId = topic.id

      // Determine level by checking position X coordinate
      const level = Math.floor((position.x - 100) / 300)

      nodeList.push(
        <FlowchartNode
          key={topic.id}
          topic={topic}
          level={level}
          position={position}
          isExpanded={isExpanded}
          onToggle={() => {
            setExpandedNodes((prev) => {
              const newSet = new Set(prev)
              if (newSet.has(topicId)) {
                newSet.delete(topicId)
              } else {
                newSet.add(topicId)
              }
              return newSet
            })
          }}
          onSelect={() => setSelectedNodeId(topicId)}
          isSelected={isSelected}
        />
      )
    })

    return nodeList
  }, [roadmapData, expandedNodes, selectedNodeId, nodePositions])

  if (!roadmapData?.topics || roadmapData.topics.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No roadmap data available</p>
      </div>
    )
  }

  return (
    <div className={styles.flowchartContainer}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#8a2be2" />
          </marker>
        </defs>
      </svg>
      <div
        className={styles.nodesContainer}
        style={{
          width: `${containerSize.width}px`,
          height: `${containerSize.height}px`,
          minWidth: `${containerSize.width}px`,
          minHeight: `${containerSize.height}px`,
        }}
      >
        <svg
          className={styles.connectionsLayer}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${containerSize.width}px`,
            height: `${containerSize.height}px`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {connections.map((conn) => (
            <line
              key={conn.key}
              x1={conn.start.x + 200}
              y1={conn.start.y + 60}
              x2={conn.end.x}
              y2={conn.end.y + 60}
              stroke="#8a2be2"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              opacity="0.6"
            />
          ))}
        </svg>
        {nodes}
      </div>
    </div>
  )
}
