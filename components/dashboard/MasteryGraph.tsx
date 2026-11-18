'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TopicNode from './TopicNode';
import SubmissionModal from './SubmissionModal';

export default function MasteryGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Register our Custom Node type
  const nodeTypes = useMemo(() => ({ customTopic: TopicNode }), []);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch('/api/topics');
        const data = await res.json();
        
        // Map backend nodes to use our custom node type
        const formattedNodes = data.nodes.map((node: any) => ({
          ...node,
          type: 'customTopic',
        }));

        setNodes(formattedNodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Failed to fetch topic graph:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGraph();
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedTopic(node);
    setIsModalOpen(true);
  }, []);

  const handleSubmissionSuccess = (updatedMastery: any) => {
    // In the future, we will update the node's mastery data here to trigger a color change dynamically
    console.log("SM-2 Mastery Updated:", updatedMastery);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-[600px] flex items-center justify-center bg-[#090807] border border-gray-800 rounded-2xl">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Building Mastery Path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[700px] bg-[#090807] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="dark"
      >
        <Background color="#333" variant={BackgroundVariant.Dots} gap={24} size={1} />
        <Controls className="bg-[#111111] border-gray-800 fill-gray-400" />
      </ReactFlow>

      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        topic={selectedTopic}
        onSuccess={handleSubmissionSuccess}
      />
    </div>
  );
}