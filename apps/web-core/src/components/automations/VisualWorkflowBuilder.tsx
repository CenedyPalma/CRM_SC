'use client';

import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Play, Settings, Mail, FileText, Database, Plus } from 'lucide-react';

// Define custom node types
const nodeTypes = {
  triggerNode: ({ data }: { data: any }) => (
    <div className="bg-white border-2 border-indigo-500 rounded-lg shadow-md p-3 w-48 flex items-center gap-3">
      <div className="bg-indigo-100 p-2 rounded-md text-indigo-600">
        <Play size={16} />
      </div>
      <div>
        <div className="text-xs font-semibold text-indigo-600 uppercase">Trigger</div>
        <div className="text-sm font-medium text-slate-800">{data.label}</div>
      </div>
    </div>
  ),
  actionNode: ({ data }: { data: any }) => (
    <div className="bg-white border border-slate-300 rounded-lg shadow-sm p-3 w-48 flex items-center gap-3">
      <div className="bg-slate-100 p-2 rounded-md text-slate-600">
        {data.icon || <Settings size={16} />}
      </div>
      <div>
        <div className="text-xs font-semibold text-slate-500 uppercase">Action</div>
        <div className="text-sm font-medium text-slate-800">{data.label}</div>
      </div>
    </div>
  ),
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'triggerNode',
    position: { x: 250, y: 100 },
    data: { label: 'On Record Created', type: 'ON_RECORD_CREATE' },
  },
];

const initialEdges: Edge[] = [];

export function VisualWorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const addActionNode = (type: string, label: string, icon: React.ReactNode) => {
    const newNode: Node = {
      id: `${nodes.length + 1}`,
      type: 'actionNode',
      position: { x: 250, y: nodes.length * 120 + 100 },
      data: { label, type, icon },
    };
    
    // Automatically connect from the last node
    const lastNode = nodes[nodes.length - 1];
    if (lastNode) {
      setEdges((eds) => addEdge({
        id: `e${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        markerEnd: { type: MarkerType.ArrowClosed }
      }, eds));
    }

    setNodes((nds) => nds.concat(newNode));
    setSelectedNodeId(newNode.id);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Visual Workflow Builder</h1>
          <p className="text-sm text-slate-500">Design automation sequences</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors">
          Save Workflow
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 flex flex-col gap-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Actions</h3>
          
          <button 
            onClick={() => addActionNode('SEND_EMAIL', 'Send Email', <Mail size={16} />)}
            className="flex items-center gap-3 w-full p-2 text-sm text-left bg-white border border-slate-200 rounded-md hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <Mail size={16} className="text-slate-500" /> Send Email
          </button>
          
          <button 
            onClick={() => addActionNode('CREATE_RECORD', 'Create Record', <Database size={16} />)}
            className="flex items-center gap-3 w-full p-2 text-sm text-left bg-white border border-slate-200 rounded-md hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <Database size={16} className="text-slate-500" /> Create Record
          </button>

          <button 
            onClick={() => addActionNode('GENERATE_PDF', 'Generate PDF', <FileText size={16} />)}
            className="flex items-center gap-3 w-full p-2 text-sm text-left bg-white border border-slate-200 rounded-md hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <FileText size={16} className="text-slate-500" /> Generate PDF
          </button>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-slate-50/50"
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        {selectedNode && (
          <div className="w-80 border-l border-slate-200 bg-white p-6 overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Properties</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Node Name</label>
                <input 
                  type="text" 
                  value={selectedNode.data.label as string}
                  onChange={(e) => {
                    setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, label: e.target.value } } : n));
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {selectedNode.data.type === 'SEND_EMAIL' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Recipient</label>
                    <input type="text" placeholder="{{record.email}}" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                    <input type="text" placeholder="Welcome {{record.name}}" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </>
              )}

              {selectedNode.type === 'triggerNode' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Target Object</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                    <option>Select an object...</option>
                    <option>Contact</option>
                    <option>Deal</option>
                  </select>
                </div>
              )}
              
            </div>
            
            <button 
              onClick={() => {
                setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                setSelectedNodeId(null);
              }}
              className="mt-8 w-full py-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Delete Node
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
