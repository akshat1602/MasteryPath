import { useEffect, useState, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, BackgroundVariant } from '@xyflow/react';
import dagre from 'dagre';
import '@xyflow/react/dist/style.css';

import TopicNode from './TopicNode';
import SubmissionModal from './SubmissionModal';

// 1. Initialize Dagre Graph
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

// 2. Layout Calculation Function
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const nodeWidth = 250;
  const nodeHeight = 120;

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function MasteryGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nodeTypes = useMemo(() => ({ customTopic: TopicNode }), []);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await fetch('/api/topics');
        const data = await res.json();
        
        const formattedNodes = data.nodes.map((node: any) => ({
          ...node,
          type: 'customTopic',
        }));

        // 3. Apply Dagre Layout before setting state
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
          formattedNodes,
          data.edges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
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

  if (isLoading) return <div className="text-white p-10">Loading graph...</div>;

  return (
    <div className="relative w-full h-full min-h-[700px] bg-[#090807]">
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

      {/* Pass ALL nodes to the modal so the dropdown can map them */}
      <SubmissionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        currentTopic={selectedTopic}
        allTopics={nodes} // <-- Pass the full list here
      />
    </div>
  );
}