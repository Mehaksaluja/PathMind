'use client'

import { useCallback } from 'react'
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
} from 'reactflow'
import 'reactflow/dist/style.css'

// Sample roadmap data - will be replaced with AI-generated data later
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'HTML Basics' },
    position: { x: 250, y: 50 },
  },
  {
    id: '2',
    type: 'default',
    data: { label: 'CSS Fundamentals' },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'default',
    data: { label: 'JavaScript Basics' },
    position: { x: 250, y: 250 },
  },
  {
    id: '4',
    type: 'default',
    data: { label: 'React Introduction' },
    position: { x: 100, y: 350 },
  },
  {
    id: '5',
    type: 'default',
    data: { label: 'React Hooks' },
    position: { x: 250, y: 350 },
  },
  {
    id: '6',
    type: 'default',
    data: { label: 'State Management' },
    position: { x: 400, y: 350 },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e3-5', source: '3', target: '5' },
  { id: 'e3-6', source: '3', target: '6' },
  { id: 'e5-6', source: '5', target: '6' },
]

interface RoadmapFlowProps {
  onTopicSelect: (topicId: string | null) => void
}

export default function RoadmapFlow({ onTopicSelect }: RoadmapFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onTopicSelect(node.id)
    },
    [onTopicSelect]
  )

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  )
}

