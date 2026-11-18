'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export default function SubmissionModal({ isOpen, onClose, topic, onSuccess }: any) {
  const [submission, setSubmission] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !topic) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/checkpoints/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000001', // Dummy ID until NextAuth is wired
          topicId: topic.id,
          checkpointType: 'transfer_problem',
          score: 85,      // Hardcoded for testing until Anshika's AI is wired
          passed: true,   // Hardcoded for testing
          grade: 4,       // Hardcoded SM-2 grade (0-5)
          userSubmission: submission,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit checkpoint');
      
      const data = await response.json();
      setSubmission('');
      onSuccess(data.mastery);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-[#090807] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#111111]">
          <div>
            <h2 className="text-lg font-bold">Transfer Check: {topic.data.label}</h2>
            <p className="text-xs text-gray-400 mt-1">Provide your verified solution or explanation.</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-400 text-sm">{error}</div>}
          
          <textarea
            value={submission}
            onChange={(e) => setSubmission(e.target.value)}
            placeholder="Write your code or reasoning here..."
            className="w-full h-40 bg-[#111111] border border-gray-800 rounded-xl p-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all"
            required
          />

          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSubmitting ? 'Verifying...' : 'Submit to Judge0'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}