'use client'

import React, { useState } from 'react'
import MasteryGraph from '@/components/MasteryGraph'
import SubmissionModal from '@/components/SubmissionModal'

export default function LearningPathsPage() {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null)

  const handleNodeSelect = (nodeId: string, nodeData: any) => {
    setSelectedNodeId(nodeId)
    setSelectedNodeData(nodeData)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">Mastery Skill Graph</h1>
        <p className="text-sm text-[#9A9692]">
          Explore your personalized prerequisite tree. Click any node to evaluate your mastery and test code solutions.
        </p>
      </div>

      {/* React Flow Canvas */}
      <MasteryGraph onNodeSelect={handleNodeSelect} />

      {/* Submission Modal */}
      <SubmissionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        nodeId={selectedNodeId}
        nodeData={selectedNodeData}
      />
    </div>
  )
}