'use client'

import React from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'

export interface TopicNodeData {
  label: string;
  category?: string;
  isMastered?: boolean;
  isDecaying?: boolean;
  transferGap?: number;
  validatorConfidence?: number;
  [key: string]: unknown;
}

export default function TopicNode({ data }: NodeProps) {
  const nodeData = data as unknown as TopicNodeData;
  const { label, category, isMastered, isDecaying, transferGap } = nodeData;

  // Determine conditional Tailwind border and glow styling
  let borderStyle = 'border-[#292725] bg-[#11100F] text-white'
  let glowStyle = ''

  if (isMastered) {
    borderStyle = 'border-emerald-500/60 bg-[#0F1F17] text-white'
    glowStyle = 'shadow-[0_0_25px_rgba(52,211,153,0.25)]'
  } else if (isDecaying) {
    borderStyle = 'border-red-500/60 bg-[#1F1212] text-white animate-pulse'
    glowStyle = 'shadow-[0_0_25px_rgba(239,68,68,0.25)]'
  }

  return (
    <div className={`relative rounded-xl border p-4 transition-all duration-300 w-64 ${borderStyle} ${glowStyle}`}>
      {/* Target handle for incoming prerequisite edges */}
      <Handle type="target" position={Position.Top} className="!bg-[#77736F] !w-2.5 !h-2.5 !-top-1.5" />

      <div className="flex flex-col gap-1.5">
        {category && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#9A9692]">
            {category}
          </span>
        )}
        <h3 className="font-bold text-sm tracking-tight">{label}</h3>

        {/* Optional Transfer Gap metric badge if provided */}
        {transferGap !== undefined && (
          <div className="mt-2 flex items-center justify-between text-[11px] pt-2 border-t border-white/10 text-[#A5A19D]">
            <span>Transfer Gap:</span>
            <span className="font-mono font-semibold text-white">{transferGap}%</span>
          </div>
        )}
      </div>

      {/* Source handle for outgoing edges */}
      <Handle type="source" position={Position.Bottom} className="!bg-[#77736F] !w-2.5 !h-2.5 !-bottom-1.5" />
    </div>
  )
}