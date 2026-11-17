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

// Card footprint (approx.) plus breathing room
const X_GAP = 240
const Y_GAP = 160
const MAX_PER_ROW = 4

// Places each topic one row below its deepest prerequisite (arrows run top to bottom).
// Rows wider than MAX_PER_ROW wrap so nothing overlaps.
function layoutGraph(nodes: TopicFlowNode[], edges: Edge[]): TopicFlowNode[] {
  const ids = new Set(nodes.map((n) => n.id))
  const prereqs = new Map<string, string[]>()
  nodes.forEach((n) => prereqs.set(n.id, []))
  edges.forEach((e) => {
    if (ids.has(e.source) && ids.has(e.target)) prereqs.get(e.target)!.push(e.source)
  })

  const depth = new Map<string, number>()
  const visiting = new Set<string>()

  const getDepth = (id: string): number => {
    const known = depth.get(id)
    if (known !== undefined) return known
    if (visiting.has(id)) return 0 // cycle guard
    visiting.add(id)
    const parents = prereqs.get(id) ?? []
    const d = parents.length === 0 ? 0 : Math.max(...parents.map(getDepth)) + 1
    visiting.delete(id)
    depth.set(id, d)
    return d
  }

  nodes.forEach((n) => getDepth(n.id))

  const layers = new Map<number, TopicFlowNode[]>()
  nodes.forEach((n) => {
    const d = depth.get(n.id) ?? 0
    layers.set(d, [...(layers.get(d) ?? []), n])
  })

  const positions = new Map<string, { x: number; y: number }>()
  let visualRow = 0

  Array.from(layers.keys())
    .sort((a, b) => a - b)
    .forEach((layerIndex) => {
      const layerNodes = layers.get(layerIndex) ?? []
      for (let start = 0; start < layerNodes.length; start += MAX_PER_ROW) {
        const chunk = layerNodes.slice(start, start + MAX_PER_ROW)
        chunk.forEach((n, col) => {
          positions.set(n.id, {
            x: (col - (chunk.length - 1) / 2) * X_GAP,
            y: visualRow * Y_GAP,
          })
        })
        visualRow += 1
      }
    })

  return nodes.map((n) => ({ ...n, position: positions.get(n.id) ?? n.position }))
}

// Fallback data so the graph still renders if the API is empty or down
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
            // The DB uses UUIDs for node.id, so match on the label for placeholder values
            const label = node.data?.label as string
            return {
              ...node,
              type: node.type || 'topicNode',
              data: {
                ...node.data,
                transferGap: node.data?.transferGap ?? (label === 'Two Pointers' ? 26 : label === 'Arrays' ? 10 : undefined),
                status: node.data?.status ?? (label === 'Two Pointers' ? 'decaying' : label === 'Arrays' ? 'mastered' : 'ready'),
                retention: node.data?.retention ?? (label === 'Two Pointers' ? 42 : 88),
              },
            }
          })
          const loadedEdges = data.edges ?? []
          setNodes(layoutGraph(formattedNodes, loadedEdges))
          setEdges(loadedEdges)
        } else {
          setNodes(layoutGraph(DEMO_NODES, DEMO_EDGES))
          setEdges(DEMO_EDGES)
        }
      } catch (err) {
        console.warn('API error, falling back to sample graph data:', err)
        setNodes(layoutGraph(DEMO_NODES, DEMO_EDGES))
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
      {/* Remove this note once real mastery data replaces the placeholder values */}
      <div
        role="note"
        className="absolute left-3 top-3 z-10 max-w-xs rounded-lg border border-amber-500/30 bg-amber-950/60 px-3 py-2 text-[11px] leading-snug text-amber-200 backdrop-blur-sm"
      >
        <span className="font-semibold">Sample progress values.</span> Status and retention shown here are placeholders, not your real mastery yet.
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeSelect?.(node.id, node.data)}
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