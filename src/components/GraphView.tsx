import React, { useMemo, useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Note } from '../types';
import { extractPlainLinks } from '../utils/linkParser';
import { X, Brain, Zap, Network } from 'lucide-react';

interface GraphViewProps {
  notes: Note[];
  onClose: () => void;
  onNodeClick: (noteId: string) => void;
}

interface NodeData {
  label: string;
  note: Note;
  connections: number;
}

export function GraphView({ notes, onClose, onNodeClick }: GraphViewProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodeMap = new Map<string, Note>();
    const connections = new Map<string, number>();
    
    // Create nodes for all notes
    notes.forEach(note => {
      nodeMap.set(note.title.toLowerCase(), note);
      connections.set(note.id, 0);
    });

    // Calculate connections and create edges
    const edges: Edge[] = [];
    const edgeSet = new Set<string>();

    notes.forEach(note => {
      const links = extractPlainLinks(note.content);
      
      links.forEach(linkTitle => {
        const targetNote = nodeMap.get(linkTitle.toLowerCase());
        if (targetNote && targetNote.id !== note.id) {
          const edgeId = `${note.id}-${targetNote.id}`;
          const reverseEdgeId = `${targetNote.id}-${note.id}`;
          
          if (!edgeSet.has(edgeId) && !edgeSet.has(reverseEdgeId)) {
            const connectionStrength = Math.min(links.length, 5);
            
            edges.push({
              id: edgeId,
              source: note.id,
              target: targetNote.id,
              type: 'smoothstep',
              style: {
                stroke: 'url(#neural-gradient)',
                strokeWidth: Math.max(1, connectionStrength),
                opacity: 0.6 + (connectionStrength * 0.1),
              },
              animated: connectionStrength > 2,
            });
            edgeSet.add(edgeId);
            
            // Update connection counts
            connections.set(note.id, (connections.get(note.id) || 0) + 1);
            connections.set(targetNote.id, (connections.get(targetNote.id) || 0) + 1);
          }
        }
      });
    });

    // Create nodes with sophisticated positioning
    const nodes: Node<NodeData>[] = notes.map((note, index) => {
      const connectionCount = connections.get(note.id) || 0;
      
      // Use golden ratio spiral for positioning
      const goldenAngle = Math.PI * (3 - Math.sqrt(5));
      const radius = Math.sqrt(index) * 40;
      const angle = index * goldenAngle;
      
      // Adjust position based on connections (central nodes closer to center)
      const adjustedRadius = radius - (connectionCount * 15);
      const x = Math.cos(angle) * adjustedRadius;
      const y = Math.sin(angle) * adjustedRadius;

      // Dynamic node sizing based on content and connections
      const contentScore = Math.min(note.content.length / 200, 8);
      const connectionScore = connectionCount * 3;
      const totalScore = contentScore + connectionScore;
      const nodeSize = Math.max(80, Math.min(160, 80 + totalScore * 4));

      // Color based on connection density
      const getNodeColor = () => {
        if (connectionCount === 0) return 'linear-gradient(135deg, #64748b 0%, #94a3b8 100%)';
        if (connectionCount <= 2) return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        if (connectionCount <= 5) return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
        return 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)';
      };

      return {
        id: note.id,
        type: 'default',
        position: { x, y },
        data: {
          label: note.title,
          note,
          connections: connectionCount,
        },
        style: {
          width: nodeSize,
          height: nodeSize,
          background: getNodeColor(),
          color: 'white',
          border: '3px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '50%',
          fontSize: Math.max(10, Math.min(14, 10 + totalScore * 0.5)),
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '12px',
          boxShadow: `
            0 0 ${20 + connectionCount * 5}px rgba(59, 130, 246, 0.3),
            0 8px 32px rgba(0, 0, 0, 0.15)
          `,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
        },
      };
    });

    return { nodes, edges };
  }, [notes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClickHandler = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
    onNodeClick(node.id);
  }, [onNodeClick]);

  const onNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          return {
            ...n,
            style: {
              ...n.style,
              transform: 'scale(1.2)',
              zIndex: 1000,
              boxShadow: `
                0 0 40px rgba(59, 130, 246, 0.6),
                0 16px 64px rgba(0, 0, 0, 0.25)
              `,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const onNodeMouseLeave = useCallback((event: React.MouseEvent, node: Node<NodeData>) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          const connectionCount = (n.data as NodeData)?.connections || 0;
          return {
            ...n,
            style: {
              ...n.style,
              transform: 'scale(1)',
              zIndex: 1,
              boxShadow: `
                0 0 ${20 + connectionCount * 5}px rgba(59, 130, 246, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.15)
              `,
            },
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 z-50 animate-fadeIn">
      <div className="w-full h-full relative">
        {/* Neural gradient definition */}
        <svg width="0" height="0">
          <defs>
            <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClickHandler}
          onNodeMouseEnter={onNodeMouseEnter}
          onNodeMouseLeave={onNodeMouseLeave}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: false,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background 
            color="#1e293b" 
            gap={30} 
            size={2}
            style={{ backgroundColor: '#0f172a' }}
          />
          <Controls 
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
            }}
          />
          <MiniMap 
            nodeColor={(node) => {
              const connectionCount = (node.data as NodeData)?.connections || 0;
              if (connectionCount === 0) return '#64748b';
              if (connectionCount <= 2) return '#3b82f6';
              if (connectionCount <= 5) return '#8b5cf6';
              return '#ec4899';
            }}
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '16px',
              backdropFilter: 'blur(12px)',
            }}
          />
          
          <Panel position="top-left" className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 shadow-neural-glow">
            <div className="text-white space-y-4">
              <div className="flex items-center gap-3">
                <Brain size={24} className="text-blue-400" />
                <h3 className="heading-serif text-xl font-medium">Neural Network</h3>
              </div>
              <div className="text-sm text-slate-300 space-y-2">
                <div className="flex items-center gap-2">
                  <Network size={16} className="text-blue-400" />
                  {notes.length} thoughts
                </div>
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-purple-400" />
                  {initialEdges.length} connections
                </div>
              </div>
            </div>
          </Panel>

          <Panel position="top-right">
            <button
              onClick={onClose}
              className="p-4 bg-slate-900/80 hover:bg-slate-800/80 backdrop-blur-xl text-white rounded-2xl border border-blue-500/30 transition-all duration-300 hover:border-blue-400/50 shadow-neural-glow"
            >
              <X size={24} />
            </button>
          </Panel>

          <Panel position="bottom-left" className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-4 border border-blue-500/30 shadow-neural-glow">
            <div className="text-white text-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                <span>Low connectivity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
                <span>Medium connectivity</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-pink-600"></div>
                <span>High connectivity</span>
              </div>
              <div className="text-slate-400 mt-4 pt-3 border-t border-slate-700">
                Click nodes to explore • Drag to navigate
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}