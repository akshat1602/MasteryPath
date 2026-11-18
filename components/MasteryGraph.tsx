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
  MarkerType,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from '@dagrejs/dagre'
import TopicNode from './TopicNode'
import { TopicsResponseSchema } from '@/lib/contracts'

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

// Approximate card footprint (TopicNode is min-w-[230px])
const NODE_W = 240
const NODE_H = 130

// Set NEXT_PUBLIC_USE_MOCKS=true in .env.local to force the sample graph
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

// Top-down hierarchical layout. Backend {x, y} positions are ignored.
function layoutGraph(nodes: TopicFlowNode[], edges: Edge[]): TopicFlowNode[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 90, marginx: 20, marginy: 20 })

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }))
  edges.forEach((e) => {
    if (g.hasNode(e.source) && g.hasNode(e.target)) g.setEdge(e.source, e.target)
  })

  dagre.layout(g)

  return nodes.map((n) => {
    const p = g.node(n.id)
    // dagre returns the node's center; React Flow wants the top-left corner
    return { ...n, position: { x: p.x - NODE_W / 2, y: p.y - NODE_H / 2 } }
  })
}

// Fallback data so the graph still renders if the API is empty, invalid, or down
const DEMO_NODES: TopicFlowNode[] = [
  {
    id: 'arrays',
    type: 'topicNode',
    position: { x: 0, y: 0 },
    data: { label: 'Arrays', category: 'Fundamentals', status: 'mastered', retention: 88, transferGap: 10, slug: 'arrays' },
  },
  {
    id: 'two-pointers',
    type: 'topicNode',
    position: { x: 0, y: 0 },
    data: { label: 'Two Pointers', category: 'Array / Two Pointers', status: 'decaying', retention: 42, transferGap: 24, slug: 'two-pointers' },
  },
  {
    id: 'sliding-window',
    type: 'topicNode',
    position: { x: 0, y: 0 },
    data: { label: 'Sliding Window', category: 'Subarrays & Substrings', status: 'ready', retention: 75, transferGap: 26, slug: 'sliding-window' },
  },
  {
    id: 'binary-search',
    type: 'topicNode',
    position: { x: 0, y: 0 },
    data: { label: 'Binary Search', category: 'Searching', status: 'pending', slug: 'binary-search' },
  },
]

const DEMO_EDGES: Edge[] = [
  { id: 'e1', source: 'arrays', target: 'two-pointers', animated: true },
  { id: 'e2', source: 'two-pointers', target: 'sliding-window', animated: true },
  { id: 'e3', source: 'two-pointers', target: 'binary-search' },
]

export default function MasteryGraph({ onNodeSelect }: MasteryGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<TopicFlowNode>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [loading, setLoading] = useState<boolean>(true)
  // True whenever the values on screen are not real mastery data
  const [usingPlaceholders, setUsingPlaceholders] = useState<boolean>(false)

  const nodeTypes = useMemo(() => ({ topicNode: TopicNode }), [])

  useEffect(() => {
    function showDemo() {
      setNodes(layoutGraph(DEMO_NODES, DEMO_EDGES))
      setEdges(DEMO_EDGES)
      setUsingPlaceholders(true)
    }

    async function fetchTopics() {
      if (USE_MOCKS) {
        showDemo()
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/topics')
        if (!response.ok) {
          throw new Error(`Failed to fetch topics (Status ${response.status})`)
        }

        // Validate the response shape against our contract
        const parsed = TopicsResponseSchema.safeParse(await response.json())
        if (!parsed.success) {
          console.warn('Topics response shape mismatch:', parsed.error.issues)
          throw new Error('Unexpected /api/topics shape')
        }
        const data = parsed.data

        if (data.nodes.length > 0) {
          // Real metrics = the API actually sent status AND retention for every node
          const hasRealMetrics = data.nodes.every(
            (n) => n.data.status !== undefined && n.data.retention !== undefined
          )

          const statusById = new Map(data.nodes.map((n) => [n.id, n.data.status]))

          // A topic is unlocked when it has no prerequisites or all of them are mastered
          const isUnlocked = (id: string) => {
            const prereqs = data.edges.filter((e) => e.target === id).map((e) => e.source)
            return prereqs.every((p) => statusById.get(p) === 'mastered')
          }

          const formattedNodes: TopicFlowNode[] = data.nodes.map((node) => {
            const apiStatus = node.data.status ?? 'ready'
            // Backend reports "pending" for untouched topics; show them as practicable
            // when they have no prerequisites or all prerequisites are mastered
            const status = apiStatus === 'pending' && isUnlocked(node.id) ? 'ready' : apiStatus
            return {
              ...node,
              type: node.type || 'topicNode',
              position: node.position ?? { x: 0, y: 0 },
              data: { ...node.data, status },
            }
          })

          setNodes(layoutGraph(formattedNodes, data.edges))
          setEdges(data.edges)
          setUsingPlaceholders(!hasRealMetrics)
        } else {
          showDemo()
        }
      } catch (err) {
        console.warn('API error, falling back to sample graph data:', err)
        showDemo()
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
      {/* Only shown while values are placeholders; disappears once real mastery data arrives */}
      {usingPlaceholders && (
        <div
          role="note"
          className="absolute left-3 top-3 z-10 max-w-xs rounded-lg border border-amber-500/30 bg-amber-950/60 px-3 py-2 text-[11px] leading-snug text-amber-200 backdrop-blur-sm"
        >
          <span className="font-semibold">Sample progress values.</span> Status and retention shown here are placeholders, not your real mastery yet.
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect?.(node.id, node.data)}
        defaultEdgeOptions={{
          type: 'default', // smooth bezier curve
          style: { stroke: '#4B4845', strokeWidth: 1.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#4B4845' },
        }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
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