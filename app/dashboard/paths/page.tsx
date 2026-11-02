'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import MasteryGraph from '@/components/MasteryGraph'
import SubmissionModal from '@/components/SubmissionModal'

export default function PathsPage() {
  const [selectedNode, setSelectedNode] = useState<{
    id: string | null
    data: any | null
  }>({ id: null, data: null })
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#070706] text-white selection:bg-[#A78BFA]/30 pb-20">
      <div className="mx-auto max-w-[1280px] px-4 pt-8 sm:px-6 lg:px-8 space-y-6">

        {/* --- Top Header & Action Row --- */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Mastery Skill Graph
              </h1>
              <span className="rounded-full border border-purple-500/30 bg-purple-950/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300">
                Interactive Prerequisite Tree
              </span>
            </div>
            <p className="mt-1 text-xs text-[#9A9692] sm:text-sm">
              Explore structural prerequisite chains. Click any node to open its checkpoint rubric or jump to practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice/two-pointers"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-[#090807] transition-all hover:bg-[#E5E5E5] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              <span>Practice Active Topic</span>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </header>

        {/* --- Top Metrics Summary Strip --- */}
        <section aria-label="Graph metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Total Core Topics',
              value: '4',
              sub: 'Two Pointers → DFS',
              gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
              border: 'hover:border-emerald-500/40',
              badge: 'Curriculum Scope',
              color: 'text-emerald-400',
            },
            {
              title: 'Prerequisite Chains',
              value: '3',
              sub: 'Linear to Hierarchical',
              gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
              border: 'hover:border-purple-500/40',
              badge: 'Dependencies',
              color: 'text-purple-400',
            },
            {
              title: 'Decaying Prerequisites',
              value: '1',
              sub: 'Two Pointers needs audit',
              gradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
              border: 'hover:border-amber-500/40',
              badge: 'SM-2 Flagged',
              color: 'text-amber-400',
            },
            {
              title: 'Overall Tree Mastery',
              value: '50%',
              sub: '2 of 4 nodes validated',
              gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
              border: 'hover:border-cyan-500/40',
              badge: 'Progress',
              color: 'text-cyan-400',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-2xl border border-[#242220] bg-[#0E0D0C] p-5 transition-all duration-300 ${item.border} hover:-translate-y-0.5 hover:shadow-xl`}
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${item.gradient} opacity-50 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-[#9A9692]">{item.title}</p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-white">{item.value}</p>
                </div>
                <span className={`rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono ${item.color}`}>
                  {item.badge}
                </span>
              </div>
              <p className="relative z-10 mt-3 text-[11px] text-[#73706D]">{item.sub}</p>
            </div>
          ))}
        </section>

        {/* --- Main Skill Graph Bento Container --- */}
        <div className="relative overflow-hidden rounded-2xl border border-[#242220] bg-[#0E0D0C] shadow-2xl">
          {/* Graph Toolbar Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#242220] bg-[#141210] px-6 py-3.5">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-white">
                Live Knowledge Graph Canvas
              </span>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#9A9692]">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>Mastered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span>Decaying (Audit Due)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#555]" />
                <span>Locked</span>
              </div>
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="h-[620px] w-full bg-[radial-gradient(#1e1c1a_1px,transparent_1px)] [background-size:18px_18px]">
            <MasteryGraph />
          </div>

          {/* Canvas Bottom Instructions */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-[#242220] bg-[#11100F] px-6 py-3 text-xs text-[#73706D]">
            <span>Click any topic node to open its checkpoint assessment modal or launch its practice workspace.</span>
            <span className="font-mono text-[#A78BFA]">Controls: Scroll to zoom · Drag to pan</span>
          </div>
        </div>

        {/* Checkpoint Modal Integration */}
        <SubmissionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          nodeId={selectedNode.id}
          nodeData={selectedNode.data}
        />
      </div>
    </div>
  )
}