'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { 
  ReactFlow, 
  useNodesState, 
  useEdgesState, 
  Background, 
  Controls, 
  MiniMap, 
  BackgroundVariant 
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import TopicNode from './TopicNode'

export default function MasteryGraph({ onNodeSelect }: { onNodeSelect?: (nodeId: string, nodeData: any) => void }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Register custom node types
  const nodeTypes = useMemo(() => ({ topicNode: TopicNode }), [])

  useEffect(() => {
    async function fetchTopics() {
      try {
        const response = await fetch('/api/topics')
        if (!response.ok) {
          throw new Error(`Failed to fetch topics (Status ${response.status})`)
        }
        const data = await response.json()
        
        // Ensure nodes use our custom node type 'topicNode'
        const formattedNodes = (data.nodes || []).map((node: any) => ({
          ...node,
          type: node.type || 'topicNode',
        }))

        setNodes(formattedNodes)
        setEdges(data.edges || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load topic graph.')
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

  if (error) {
    return (
      <div className="h-[600px] w-full rounded-2xl border border-red-900/40 bg-red-950/20 flex flex-col items-center justify-center text-center p-6 space-y-3">
        <p className="text-red-400 font-semibold">Could not load graph</p>
        <p className="text-sm text-[#9A9692]">{error}</p>
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
            const data = node.data as any
            if (data?.isMastered) return '#34D399'
            if (data?.isDecaying) return '#EF4444'
            return '#6B7280'
          }}
          maskColor="rgba(9, 8, 7, 0.8)"
        />
      </ReactFlow>
    </div>
  )
}