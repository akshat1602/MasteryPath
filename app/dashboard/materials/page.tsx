'use client'

import React, { useRef, useState } from 'react'
import { askRagQuestion } from '@/lib/services/materialService'
import type { RagAnswerResponse } from '@/types/api'

// Limits enforced by the backend route
const MAX_PDF_BYTES = 10 * 1024 * 1024
const MAX_QUESTION_CHARS = 2000

function validatePdf(file: File): string | null {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) return 'Only PDF files are supported.'
  if (file.size === 0) return 'That file is empty.'
  if (file.size > MAX_PDF_BYTES) return 'File size exceeds the 10 MB limit.'
  return null
}

export default function MaterialsPage() {
  const [query, setQuery] = useState('')
  const [isAsking, setIsAsking] = useState(false)
  const [qaResponse, setQaResponse] = useState<RagAnswerResponse | null>(null)
  const [askedQuestion, setAskedQuestion] = useState('')
  const [askError, setAskError] = useState<string | null>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectFile = (file: File | undefined) => {
    setFileError(null)
    if (!file) return

    const problem = validatePdf(file)
    if (problem) {
      setFileError(problem)
      return
    }

    setSelectedFile(file)
    // A new document makes the previous answer misleading
    setQaResponse(null)
    setAskError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(e.target.files?.[0])
    // Lets the student pick the same file again later
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    selectFile(e.dataTransfer.files?.[0])
  }

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault()
    const question = query.trim()
    if (!question) return

    if (!selectedFile) {
      setFileError('Please select a PDF document first before asking a question.')
      return
    }

    setIsAsking(true)
    setQaResponse(null)
    setAskError(null)
    setFileError(null)
    setAskedQuestion(question)

    try {
      setQaResponse(await askRagQuestion(selectedFile, question))
    } catch (err) {
      setAskError(err instanceof Error ? err.message : 'An error occurred while analysing the document.')
    } finally {
      setIsAsking(false)
    }
  }

  // The backend returns sources: [] when nothing in the notes matched
  const sources = qaResponse?.sources ?? []
  const hasSources = sources.length > 0

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pt-8 pb-20 sm:px-6 lg:px-8 text-white">
      <header className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Learning Materials</h1>
        <p className="text-sm text-[#A8A39E]">
          Upload a PDF of your notes, then ask questions. Answers are drawn only from your document, with the
          supporting passages shown.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column: Upload Zone */}
        <div className="space-y-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,.pdf"
            className="hidden"
          />

          <div
            role="button"
            tabIndex={0}
            aria-label="Choose a PDF to upload"
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed bg-[#0E0D0C] px-6 py-12 text-center transition-all hover:bg-[#11100F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA] ${
              isDragging
                ? 'border-[#A78BFA] bg-[#11100F]'
                : selectedFile
                ? 'border-emerald-500/50 hover:border-emerald-400'
                : 'border-[#3D3A37] hover:border-[#A78BFA]'
            }`}
          >
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#292725] bg-[#141210] ${
                selectedFile ? 'text-emerald-400' : 'text-[#A78BFA]'
              }`}
            >
              {selectedFile ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )}
            </div>

            <h3 className="mb-1 break-all text-sm font-bold text-white">
              {selectedFile ? selectedFile.name : 'Click or drag a PDF here'}
            </h3>
            <p className="text-xs text-[#73706D]">
              {selectedFile
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · click to choose a different file`
                : 'PDF only, up to 10 MB'}
            </p>
          </div>

          {fileError && (
            <div role="alert" className="rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {fileError}
            </div>
          )}
        </div>

        {/* Right Column: Q&A Interface */}
        <div className="flex h-[600px] flex-col rounded-2xl border border-[#242220] bg-[#0E0D0C] p-6 shadow-xl">
          <h3 className="mb-4 text-sm font-bold text-white">Ask your materials</h3>

          <div aria-live="polite" className="mb-4 flex-1 space-y-4 overflow-y-auto rounded-xl border border-[#1E1C1A] bg-[#141210] p-4">
            {isAsking && (
              <div role="status" className="flex h-full flex-col items-center justify-center gap-3 text-[#9A9692]">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <p className="text-sm">Reading your document…</p>
              </div>
            )}

            {!isAsking && askError && (
              <div role="alert" className="rounded-lg border border-red-500/30 bg-red-950/20 p-4 text-sm text-red-400">
                {askError}
              </div>
            )}

            {!isAsking && qaResponse && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-3 duration-500">
                {askedQuestion && <p className="text-xs text-[#73706D]">You asked: {askedQuestion}</p>}

                <div className="whitespace-pre-wrap break-words rounded-lg bg-[#1C1A18] p-4 text-sm leading-relaxed text-[#D0D0D0]">
                  {qaResponse.answer}
                </div>

                {hasSources ? (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[#73706D]">
                      Passages used ({sources.length})
                    </h4>
                    {sources.map((src) => (
                      <details key={src.chunkIndex} className="rounded-lg border border-[#292725] bg-[#11100F] px-3 py-2">
                        <summary className="cursor-pointer text-xs font-medium text-[#A8A39E]">
                          Chunk {src.chunkIndex}
                        </summary>
                        <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap break-words text-xs leading-relaxed text-[#9A9692]">
                          {src.text}
                        </p>
                      </details>
                    ))}
                    <p className="text-[10px] text-[#73706D]">
                      Chunk labels match the citations in the answer, such as [Chunk 2].
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-amber-400/80">
                    No passages in this document matched your question, so nothing is cited. Try rewording it or
                    upload notes that cover this topic.
                  </p>
                )}

                {qaResponse.metadata && (
                  <p className="text-[10px] text-[#73706D]">
                    Searched {qaResponse.metadata.totalPages} pages in {qaResponse.metadata.totalChunks} passages
                    · used {qaResponse.metadata.retrievedChunks}
                  </p>
                )}
              </div>
            )}

            {!isAsking && !qaResponse && !askError && (
              <div className="flex h-full flex-col items-center justify-center text-center text-[#73706D] opacity-60">
                <svg className="mb-2 h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Select a PDF on the left, then ask a question.</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAskQuestion} className="relative">
            <label htmlFor="rag-question" className="sr-only">
              Your question
            </label>
            <input
              id="rag-question"
              type="text"
              value={query}
              maxLength={MAX_QUESTION_CHARS}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isAsking}
              placeholder="Ask about your document..."
              className="h-12 w-full rounded-xl border border-[#292725] bg-[#090807] pl-4 pr-12 text-sm text-white transition-all placeholder:text-[#73706D] focus:border-[#A78BFA] focus:outline-none focus:ring-1 focus:ring-[#A78BFA] disabled:opacity-50"
            />
            <button
              type="submit"
              aria-label="Ask question"
              disabled={!query.trim() || isAsking || !selectedFile}
              className="absolute inset-y-0 right-1.5 my-1.5 flex w-9 items-center justify-center rounded-lg bg-[#141210] text-[#A8A39E] transition-colors hover:bg-[#A78BFA] hover:text-white disabled:opacity-50"
            >
              {isAsking ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}