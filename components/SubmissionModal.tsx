'use client';
import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

// Accept allTopics array passed down from MasteryGraph
export default function SubmissionModal({ isOpen, onClose, currentTopic, allTopics }: any) {
  const [selectedTopicId, setSelectedTopicId] = useState('');

  // Sync the dropdown with the node the user clicked on the graph
  useEffect(() => {
    if (currentTopic) {
      setSelectedTopicId(currentTopic.id);
    }
  }, [currentTopic]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-4xl bg-[#090807] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Header & Dynamic Dropdown */}
        <div className="flex justify-between items-center p-5 border-b border-gray-800 bg-[#111111]">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold">Problem Workspace</h2>
            
            {/* DYNAMIC TOPIC DROPDOWN */}
            <select 
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2"
            >
              {allTopics?.map((topic: any) => (
                <option key={topic.id} value={topic.id}>
                  {topic.data.label}
                </option>
              ))}
            </select>

          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* ... Rest of your split-pane modal UI ... */}
        <div className="p-5 flex gap-4 min-h-[400px]">
           <div className="flex-1 border border-gray-800 rounded-lg p-4">Left Panel: AI Problem</div>
           <div className="flex-1 border border-gray-800 rounded-lg p-4">Right Panel: Code Input</div>
        </div>

      </div>
    </div>
  );
}