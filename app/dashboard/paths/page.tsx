'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import MasteryGraph from '@/components/MasteryGraph'
import SubmissionModal from '@/components/SubmissionModal'
import { getTopicBySlug, getTopicByLabel } from '@/lib/topics'

export default function LearningPathsPage() {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedNodeData, setSelectedNodeData] = useState<any | null>(null)

  const handleNodeSelect = (nodeId: string, nodeData: any) => {
    // Match the clicked node to our practice topics: slug first, then label
    const topic =
      getTopicBySlug(String(nodeData?.slug ?? '')) ??
      getTopicByLabel(String(nodeData?.label ?? ''))

    if (topic) {
      // Supported topics open the practice page; unsupported ones show "Coming soon" there
      router.push(`/practice/${topic.slug}`)
      return
    }

    // Any other topic keeps the existing checkpoint modal
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
          Explore your personalized prerequisite tree. Click a topic to open its practice workspace.
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