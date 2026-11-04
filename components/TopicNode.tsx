'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'
import { Handle, Position, type NodeProps } from '@xyflow/react'

export interface TopicNodeData {
  label: string
  category?: string
  status?: 'mastered' | 'ready' | 'decaying' | 'pending'
  retention?: number
  transferGap?: number
  slug?: string
  [key: string]: unknown
}

function TopicNode({ data, selected }: NodeProps) {
  const router = useRouter()
  const nodeData = data as unknown as TopicNodeData
  const status = nodeData.status ?? 'ready'

  // Map label to slug if slug is missing
  const topicSlug =
    nodeData.slug ||
    nodeData.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

  const statusConfig = {
    mastered: {
      border: 'border-emerald-500/40 hover:border-emerald-400',
      badge: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
      glow: 'from-emerald-500/15 via-emerald-500/5 to-transparent',
      dot: 'bg-emerald-400',
      accentText: 'text-emerald-400',
      label: 'Mastered',
      clickable: true,
    },
    decaying: {
      border: 'border-red-500/40 hover:border-red-400',
      badge: 'border-red-500/30 bg-red-950/40 text-red-300',
      glow: 'from-red-500/15 via-red-500/5 to-transparent',
      dot: 'bg-red-400 animate-pulse',
      accentText: 'text-red-400',
      label: 'Decaying (Review)',
      clickable: true,
    },
    ready: {
      border: 'border-orange-500/40 hover:border-orange-400',
      badge: 'border-orange-500/30 bg-orange-950/40 text-orange-300',
      glow: 'from-orange-500/20 via-orange-500/5 to-transparent',
      dot: 'bg-orange-400',
      accentText: 'text-orange-400',
      label: 'Active',
      clickable: true,
    },
    pending: {
      border: 'border-[#292725] hover:border-[#3D3A37]',
      badge: 'border-[#333] bg-[#141210] text-[#73706D]',
      glow: 'from-white/[0.02] to-transparent',
      dot: 'bg-[#555]',
      accentText: 'text-[#73706D]',
      label: 'Prerequisite Locked',
      clickable: false,
    },
  }[status]

  const handleOpenPractice = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (statusConfig.clickable) {
      router.push(`/practice/${topicSlug}`)
    }
  }

  return (
    <div
      onClick={handleOpenPractice}
      className={`group relative min-w-[230px] rounded-2xl border bg-[#0E0D0C] p-4 text-left shadow-xl transition-all duration-300 cursor-pointer ${
        statusConfig.border
      } ${selected ? 'ring-2 ring-[#A78BFA] ring-offset-2 ring-offset-[#070706]' : ''}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={`!h-2.5 !w-2.5 !border-2 !border-[#0E0D0C] !bg-[#73706D] transition-colors ${
          status === 'mastered' ? 'group-hover:!bg-emerald-400' :
          status === 'decaying' ? 'group-hover:!bg-red-400' :
          status === 'ready' ? 'group-hover:!bg-orange-400' : ''
        }`}
      />

      {/* Top Ambient Glow */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-16 rounded-t-2xl bg-gradient-to-b ${statusConfig.glow} opacity-70 transition-opacity group-hover:opacity-100`}
      />

      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#73706D]">
            {nodeData.category ?? 'Algorithm Pattern'}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-mono font-medium ${statusConfig.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${statusConfig.dot}`} />
            {statusConfig.label}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-bold tracking-tight text-white transition-colors group-hover:${statusConfig.accentText}`}>
            {nodeData.label}
          </h3>
          <span className="text-xs text-[#9A9692] group-hover:text-white transition-colors">
            →
          </span>
        </div>

       <div className="flex items-center justify-between pt-2 border-t border-[#1C1A18] text-[10px] text-[#9A9692]">
          <span>
            Retention: <strong className="font-mono text-white">{nodeData.retention ?? 70}%</strong>
          </span>
          {/* Transfer Gap Indicator Module */}
          {nodeData.transferGap !== undefined ? (
            <span className={`font-mono font-medium tracking-wide ${nodeData.transferGap > 20 ? 'text-amber-400 animate-pulse' : 'text-[#A78BFA]'}`}>
              Δ {nodeData.transferGap}% gap
            </span>
          ) : (
            <span className="font-medium text-orange-400 hover:text-white transition-colors cursor-pointer underline underline-offset-2">
              Practice
            </span>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={`!h-2.5 !w-2.5 !border-2 !border-[#0E0D0C] !bg-[#73706D] transition-colors ${
          status === 'mastered' ? 'group-hover:!bg-emerald-400' :
          status === 'decaying' ? 'group-hover:!bg-red-400' :
          status === 'ready' ? 'group-hover:!bg-orange-400' : ''
        }`}
      />
    </div>
  )
}

export default memo(TopicNode)