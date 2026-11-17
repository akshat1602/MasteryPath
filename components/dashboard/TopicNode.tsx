'use client';

import { Handle, Position } from '@xyflow/react';

export default function TopicNode({ data }: { data: any }) {
  // We will pass these down from the user_topic_mastery table later.
  // Defaulting to 'learning' state for testing.
  const transferGap = data.transferGap || 0;
  const isMastered = data.transferScore && data.transferScore >= 80;
  const isDecaying = transferGap > 25; 

  let ringColor = 'ring-gray-700/50 border-gray-700'; // Default / Locked
  let badge = null;

  if (isMastered && !isDecaying) {
    ringColor = 'ring-emerald-500/50 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
    badge = <span className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">Mastered</span>;
  } else if (isDecaying) {
    ringColor = 'ring-red-500/50 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
    badge = <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Review Due</span>;
  } else if (data.status === 'active') {
    ringColor = 'ring-blue-500/50 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]';
  }

  return (
    <div className={`relative p-4 rounded-xl bg-[#111111] text-white border ring-1 ${ringColor} w-56 transition-all duration-200 hover:scale-105`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500 !border-none" />
      
      {badge}
      
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-sm text-gray-100">{data.label}</h3>
        <p className="text-xs text-gray-400 line-clamp-2">{data.description}</p>
        
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-800">
          <span className="text-[10px] text-gray-500">{data.estimatedMinutes} mins</span>
          {data.transferScore !== undefined && (
            <span className="text-[10px] font-mono text-gray-400">Score: {data.transferScore}%</span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500 !border-none" />
    </div>
  );
}