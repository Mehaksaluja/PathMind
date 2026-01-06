'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'
import styles from './RoadmapFlow.module.css'

const CustomNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const levelColors: Record<string, string> = {
    beginner: '#10b981',
    intermediate: '#3b82f6',
    advanced: '#8b5cf6',
  }

  const levelColor = levelColors[data.level] || '#6b7280'

  return (
    <div
      className={styles.customNode}
      style={{
        background: selected
          ? 'rgba(138, 43, 226, 0.25)'
          : 'rgba(20, 10, 40, 0.98)',
        border: `2px solid ${selected ? '#8a2be2' : levelColor}`,
        borderRadius: '10px',
        padding: '12px 16px',
        minWidth: '160px',
        maxWidth: '220px',
        boxShadow: selected
          ? '0 4px 16px rgba(138, 43, 226, 0.4)'
          : '0 2px 8px rgba(0, 0, 0, 0.3)',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: levelColor, width: '6px', height: '6px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: '#ffffff',
              lineHeight: '1.3',
              flex: 1,
            }}
          >
            {data.label}
          </span>
          {data.hasChildren && (
            <span style={{ fontSize: '12px', color: levelColor }}>
              {data.isExpanded ? '▼' : '▶'}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {data.level && (
            <span
              style={{
                padding: '3px 8px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: 600,
                textTransform: 'uppercase',
                background: `${levelColor}20`,
                color: levelColor,
                border: `1px solid ${levelColor}40`,
              }}
            >
              {data.level}
            </span>
          )}
          {data.estimatedHours && (
            <span
              style={{
                fontSize: '9px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {data.estimatedHours}h
            </span>
          )}
        </div>
        {data.hasChildren && !data.isExpanded && (
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(138, 43, 226, 0.7)',
              fontWeight: 500,
            }}
          >
            {data.childCount || 0} subtopics
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: levelColor, width: '6px', height: '6px' }} />
    </div>
  )
}

const nodeTypes = {
  default: CustomNode,
}

interface RoadmapFlowProps {
  onTopicSelect: (topicId: string | null, nodeId: string | null) => void
  roadmapData?: {
    flowData?: { nodes: any[]; edges: any[] }
    topicMap?: Record<string, any>
  } | null
}

export default function RoadmapFlow({ onTopicSelect, roadmapData }: RoadmapFlowProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const allNodes = useMemo(() => {
    if (!roadmapData?.flowData?.nodes) return []
    return roadmapData.flowData.nodes
  }, [roadmapData])

  const allEdges = useMemo(() => {
    if (!roadmapData?.flowData?.edges) return []
    return roadmapData.flowData.edges
  }, [roadmapData])

  useEffect(() => {
    if (allNodes.length > 0) {
      const rootNodes = allNodes.filter((node: any) => !node.data?.parentId)
      setExpandedNodes(new Set(rootNodes.map((n: any) => n.id)))
    }
  }, [allNodes.length])

  const visibleNodes = useMemo(() => {
    if (allNodes.length === 0) return []
    
    const visible = new Set<string>()
    const queue: string[] = []
    
    allNodes.forEach((node: any) => {
      if (!node.data?.parentId) {
        visible.add(node.id)
        if (expandedNodes.has(node.id)) {
          queue.push(node.id)
        }
      }
    })

    while (queue.length > 0) {
      const parentId = queue.shift()!
      allNodes.forEach((node: any) => {
        if (node.data?.parentId === parentId) {
          visible.add(node.id)
          if (expandedNodes.has(node.id)) {
            queue.push(node.id)
          }
        }
      })
    }

    return allNodes
      .filter((node: any) => visible.has(node.id))
      .map((node: any) => ({
        ...node,
        type: 'default',
        data: {
          ...node.data,
          isExpanded: expandedNodes.has(node.id),
        },
      }))
  }, [allNodes, expandedNodes])

  const visibleEdges = useMemo(() => {
    if (allEdges.length === 0) return []
    const visibleNodeIds = new Set(visibleNodes.map((n: any) => n.id))
    return allEdges
      .filter((edge: any) => {
        return visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
      })
      .map((edge: any) => ({
        ...edge,
        type: 'smoothstep',
        animated: false,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#8a2be2',
        },
        style: {
          stroke: '#8a2be2',
          strokeWidth: 2,
        },
      }))
  }, [allEdges, visibleNodes])

  const [nodes, setNodes, onNodesChange] = useNodesState(visibleNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(visibleEdges)

  useEffect(() => {
    if (visibleNodes.length > 0) {
      setNodes(visibleNodes)
    }
  }, [visibleNodes, setNodes])

  useEffect(() => {
    if (visibleEdges.length > 0) {
      setEdges(visibleEdges)
    }
  }, [visibleEdges, setEdges])

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.stopPropagation()
      
      const topicData = roadmapData?.topicMap?.[node.id]
      
      if (topicData?.children && topicData.children.length > 0) {
        setExpandedNodes((prev) => {
          const newSet = new Set(prev)
          if (newSet.has(node.id)) {
            newSet.delete(node.id)
          } else {
            newSet.add(node.id)
          }
          return newSet
        })
      }

      if (topicData) {
        onTopicSelect(topicData.id || null, node.id)
      } else {
        onTopicSelect(null, null)
      }
    },
    [onTopicSelect, roadmapData]
  )

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  if (!roadmapData?.flowData || allNodes.length === 0) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '1rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}></div>
          <p>No roadmap data available</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', height: '100%', flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
        minZoom={0.3}
        maxZoom={1.5}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Background 
          color="rgba(138, 43, 226, 0.1)"
          gap={25}
          size={1}
          variant="dots"
        />
        <Controls 
          showInteractive={true}
          style={{
            button: {
              backgroundColor: 'rgba(20, 10, 40, 0.95)',
              border: '1px solid rgba(138, 43, 226, 0.3)',
              color: 'white',
              width: '32px',
              height: '32px',
            },
          }}
        />
        <MiniMap
          nodeColor={(node) => {
            const levelColors: Record<string, string> = {
              beginner: '#10b981',
              intermediate: '#3b82f6',
              advanced: '#8b5cf6',
            }
            return levelColors[node.data?.level] || '#6b7280'
          }}
          style={{
            backgroundColor: 'rgba(20, 10, 40, 0.9)',
            border: '1px solid rgba(138, 43, 226, 0.3)',
          }}
          maskColor="rgba(0, 0, 0, 0.5)"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  )
}
