'use client'

import React, { useEffect, useState, useMemo } from 'react'
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TopicNode from './TopicNode'

export type TopicNodeData = {
  label?: string
  status?: 'mastered' | 'ready' | 'decaying' | 'pending'
  retention?: number
  transferGap?: number
  [key: string]: unknown
}

export type TopicFlowNode = Node<TopicNodeData>

type MasteryGraphProps = {
  onNodeSelect?: (nodeId: string, nodeData: TopicNodeData) => void
}

// Fallback SM-2 test data so you can see the animations locally
const DEMO_NODES: TopicFlowNode[] = [
  {
    id: 'two-pointers',
    type: 'topicNode',
    position: { x: 250, y: 50 },
    data: { 
      label: 'Two Pointers', 
      category: 'Array / Two Pointers', 
      status: 'decaying', 
      retention: 42, 
      transferGap: 24,
      slug: 'two-pointers' 
    },
  },
  {
    id: 'arrays',
    type: 'topicNode',
    position: { x: 50, y: 150 },
    data: { 
      label: 'Arrays', 
      category: 'Fundamentals', 
      status: 'mastered', 
      retention: 88, 
      transferGap: 10,
      slug: 'arrays'
    },
  },
  {
    id: 'sliding-window',
    type: 'topicNode',
    position: { x: 450, y: 150 },
    data: { 
      label: 'Sliding Window', 
      category: 'Subarrays & Substrings', 
      status: 'ready', 
      retention: 75, 
      transferGap: 26,
      slug: 'sliding-window'
    },
  },
  {
    id: 'binary-search',
    type: 'topicNode',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Binary Search', 
      category: 'Searching', 
      status: 'pending',
      slug: 'binary-search'
    },
  }
]

const DEMO_EDGES: Edge[] = [
  { id: 'e1', source: 'arrays', target: 'two-pointers', animated: true },
  { id: 'e2', source: 'two-pointers', target: 'sliding-window', animated: true },
  { id: 'e3', source: 'two-pointers', target: 'binary-search' }
]

export default function MasteryGraph({ onNodeSelect }: MasteryGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<TopicFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const nodeTypes = useMemo(() => ({ topicNode: TopicNode }), [])

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch('/api/topics')
        if (!response.ok) {
          throw new Error(`Failed to fetch topics (Status ${response.status})`)
        }
        const data: { nodes?: TopicFlowNode[]; edges?: Edge[] } = await response.json()
if (data.nodes && data.nodes.length > 0) {
          const formattedNodes: TopicFlowNode[] = data.nodes.map((node) => {
            // Match against the label since the DB uses UUIDs for the actual node.id
            const label = node.data?.label as string;
            return {
              ...node,
              type: node.type || 'topicNode',
              data: {
                ...node.data,
                transferGap: node.data?.transferGap ?? (label === 'Two Pointers' ? 26 : label === 'Arrays' ? 10 : undefined),
                status: node.data?.status ?? (label === 'Two Pointers' ? 'decaying' : label === 'Arrays' ? 'mastered' : 'ready'),
                retention: node.data?.retention ?? (label === 'Two Pointers' ? 42 : 88)
              }
            };
          })
          setNodes(formattedNodes)
          setEdges(data.edges ?? [])
        } else {
          // Fallback to SM-2 mock data if backend is empty/pending
          setNodes(DEMO_NODES)
          setEdges(DEMO_EDGES)
        }
      } catch (err) {
        console.warn('API error, falling back to mock graph data:', err)
        setNodes(DEMO_NODES)
        setEdges(DEMO_EDGES)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [setNodes, setEdges])

  if (loading) {
    return (
      <div className="h-[600px] w-full rounded-2xl border border-[#292725] bg-[#11100F] flex items-center justify-center text-[#9A9692] gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        Loading mastery skill graph...
      </div>
    )
  }

  return (
    <div className="h-[650px] w-full rounded-2xl border border-[#292725] bg-[#090807] overflow-hidden shadow-2xl relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect?.(node.id, node.data)}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#292725" />
        <Controls className="!bg-[#11100F] !border-[#292725] !rounded-xl !overflow-hidden [&>button]:!bg-[#11100F] [&>button]:!border-b-[#292725] [&>button]:!text-white hover:[&>button]:!bg-[#1A1816]" />
        <MiniMap
          className="!bg-[#11100F] !border !border-[#292725] !rounded-xl overflow-hidden shadow-lg"
          nodeColor={(node) => {
            const data = node.data as TopicNodeData
            if (data?.status === 'mastered') return '#34D399'
            if (data?.status === 'decaying') return '#EF4444'
            if (data?.status === 'ready') return '#F97316'
            return '#6B7280'
          }}
          maskColor="rgba(9, 8, 7, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}