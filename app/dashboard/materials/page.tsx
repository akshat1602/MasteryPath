'use client'

import React, { useState, useRef } from 'react'
import { askRagQuestion, type AskResponse } from '@/lib/services/materialService'

export default function MaterialsPage() {
  const [query, setQuery] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [qaResponse, setQaResponse] = useState<AskResponse | null>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection from the hidden input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are currently supported by the RAG engine.')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds the 10MB limit.')
      return
    }

    setSelectedFile(file)
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    if (!selectedFile) {
      setUploadError('Please select a PDF document first before asking a question.')
      return
    }
    
    setIsAsking(true)
    setQaResponse(null)
    setUploadError(null)

    try {
      const response = await askRagQuestion(selectedFile, query)
      
      // Map the response gracefully if backend hasn't implemented 'hasRelevantMaterial' yet
      setQaResponse({
        ...response,
        hasRelevantMaterial: response.hasRelevantMaterial ?? (response.sources && response.sources.length > 0)
      })
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred while analyzing the document.')
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 pb-20 sm:px-6 lg:px-8 text-white">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Learning Materials
        </h1>
        <p className="text-sm text-[#A8A39E]">
          Upload your notes, PDFs, or roadmaps. Ask questions and get answers cited directly from your sources.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Upload Zone */}
        <div className="space-y-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="application/pdf"
            className="hidden" 
          />
          
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#3D3A37] bg-[#0E0D0C] px-6 py-12 text-center transition-all hover:bg-[#11100F] ${
              selectedFile ? 'border-emerald-500/50 hover:border-emerald-400' : 'hover:border-[#A78BFA]'
            }`}
          >
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#292725] bg-[#141210] ${selectedFile ? 'text-emerald-400' : 'text-[#A78BFA]'}`}>
              {selectedFile ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
              )}
            </div>
            
            <h3 className="text-sm font-bold text-white mb-1">
              {selectedFile ? selectedFile.name : 'Click or drag files to upload'}
            </h3>
            <p className="text-xs text-[#73706D]">
              {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Supports PDF (Max 10MB)'}
            </p>
          </div>

          {uploadError && (
             <div className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
               {uploadError}
             </div>
          )}
        </div>

        {/* Right Column: Q&A Interface */}
        <div className="flex flex-col rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl h-[600px]">
          <h3 className="text-sm font-bold text-white mb-4">Ask your materials</h3>
          
          {/* Chat / Answer Area */}
          <div className="flex-1 overflow-y-auto rounded-xl border border-[#1E1C1A] bg-[#141210] p-4 mb-4 space-y-4">
            {qaResponse ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="rounded-lg bg-[#1C1A18] p-4 text-sm text-[#D0D0D0] leading-relaxed">
                  {qaResponse.answer}
                </div>
                
                {/* Source Citations */}
                {qaResponse.hasRelevantMaterial && qaResponse.sources && qaResponse.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {qaResponse.sources.map((src, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 rounded bg-[#292725] px-2 py-1 text-[11px] font-medium text-[#A8A39E]">
                        <svg className="h-3 w-3 text-[#A78BFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        {src.filename || selectedFile?.name || 'Document'} {src.page ? `, pg. ${src.page}` : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* No Relevant Material State */}
                {!qaResponse.hasRelevantMaterial && (
                  <div className="mt-2 text-xs text-amber-400/80">
                    * Showing a generalized answer as no exact matches were found in your documents.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-[#73706D] opacity-60">
                <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <p className="text-sm">Select a PDF on the left, then ask a question.</p>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form onSubmit={handleAskQuestion} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isAsking}
              placeholder="Ask about your document..."
              className="h-12 w-full rounded-xl border border-[#292725] bg-[#090807] pl-4 pr-12 text-sm text-white placeholder:text-[#73706D] focus:border-[#A78BFA] focus:outline-none focus:ring-1 focus:ring-[#A78BFA] transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!query.trim() || isAsking || !selectedFile}
              className="absolute inset-y-0 right-1.5 my-1.5 flex w-9 items-center justify-center rounded-lg bg-[#141210] text-[#A8A39E] hover:bg-[#A78BFA] hover:text-white disabled:opacity-50 transition-colors"
            >
              {isAsking ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}