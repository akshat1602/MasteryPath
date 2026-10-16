'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { generateProblem, GeneratedProblemResult } from '@/lib/services/problemService'

export default function TwoPointersPracticePage() {
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [problemData, setProblemData] = useState<GeneratedProblemResult | null>(null)

  const fetchTwoPointersProblem = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await generateProblem('Two Pointers')
      setProblemData(response.result)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating the problem.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTwoPointersProblem()
  }, [])

  return (
    <div className="min-h-screen bg-[#090807] text-white px-6 py-10">
      <div className="mx-auto max-w-4xl">
        
        {/* Navigation Header */}
        <div className="mb-8 flex items-center justify-between border-b border-[#292725] pb-4">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-[#9A9692] hover:text-white transition-colors flex items-center gap-2"
          >
            ← Back to Dashboard
          </Link>
          <span className="rounded-full bg-[#1A1816] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#A78BFA] border border-[#292725]">
            Pattern: Two Pointers
          </span>
        </div>

        {/* Header Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Problem Workspace</h1>
            <p className="text-sm text-[#9A9692] mt-1">AI-generated problem instance grounded in verified pattern DNA.</p>
          </div>
          <button
            onClick={fetchTwoPointersProblem}
            disabled={loading}
            className="h-10 px-4 rounded-lg bg-white text-[#090807] text-sm font-semibold hover:bg-[#E5E5E5] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          >
            {loading && (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Generating Problem...' : 'Generate New Variation'}
          </button>
        </div>

        {/* Loading State */}
        {loading && !problemData && (
          <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-12 text-center space-y-4 animate-pulse">
            <div className="mx-auto h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
            <p className="text-sm text-[#9A9692]">Consulting RAG engine and verifying structure...</p>
          </div>
        )}

        {/* Error State with Retry */}
        {error && (
          <div className="rounded-2xl border border-red-900/40 bg-red-950/20 p-6 text-center space-y-4">
            <h3 className="text-lg font-semibold text-red-400">Generation Failed</h3>
            <p className="text-sm text-[#9A9692] max-w-md mx-auto">{error}</p>
            <button
              onClick={fetchTwoPointersProblem}
              className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
            >
              Retry Generation
            </button>
          </div>
        )}

        {/* Success State: Display Problem */}
        {!loading && problemData && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Title & Statement Card */}
            <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white">{problemData.title}</h2>
              <div className="text-sm leading-relaxed text-[#D0D0D0] whitespace-pre-wrap font-sans">
                {problemData.problemStatement}
              </div>

              {/* Constraints */}
              {problemData.constraints && problemData.constraints.length > 0 && (
                <div className="pt-4 border-t border-[#292725]">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9A9692] mb-3">Constraints</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[#A5A19D] font-mono">
                    {problemData.constraints.map((constraint, idx) => (
                      <li key={idx}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Examples Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Examples</h3>
              {problemData.examples.map((example, idx) => (
                <div key={idx} className="rounded-xl border border-[#292725] bg-[#11100F] p-6 space-y-3 font-mono text-sm">
                  <div className="text-xs uppercase tracking-wider text-[#73706D] font-sans font-semibold">Example {idx + 1}</div>
                  <div>
                    <span className="text-[#9A9692]">Input:</span> <span className="text-white">{example.input}</span>
                  </div>
                  <div>
                    <span className="text-[#9A9692]">Output:</span> <span className="text-white">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-[#292725] text-xs text-[#9A9692] font-sans">
                      <span className="font-semibold text-white">Explanation:</span> {example.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pattern Reasoning & Expected Approach */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-6 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#A78BFA]">Pattern Reasoning</h4>
                <p className="text-sm text-[#9A9692] leading-relaxed font-sans">{problemData.patternReasoning}</p>
              </div>
              <div className="rounded-2xl border border-[#292725] bg-[#11100F] p-6 space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#4ADE80]">Expected Approach</h4>
                <p className="text-sm text-[#9A9692] leading-relaxed font-sans">{problemData.expectedApproach}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}