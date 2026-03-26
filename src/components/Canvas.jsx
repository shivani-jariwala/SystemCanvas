/**
 * Canvas (Center Panel)
 *
 * Hosts the React Flow instance wired to the Zustand store.
 * Handles native HTML5 drop events from the Sidebar palette.
 * Includes the floating Toolbar and MiniMap.
 */
import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AnimatePresence, motion } from 'framer-motion';

import useCanvasStore from '../store/useCanvasStore';
import nodeTypes from './nodes';
import Toolbar from './Toolbar';

/** MIME type used as the drag-and-drop data channel. */
const DND_MIME = 'application/systemcanvas-node';

function Canvas() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const setSelectedNodeId = useCanvasStore((s) => s.setSelectedNodeId);

  const { screenToFlowPosition } = useReactFlow();

  /** Fallback styles applied to every new edge unless overridden. */
  const defaultEdgeOptions = useMemo(() => ({
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }), []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData(DND_MIME);
      if (!raw) return;

      const { type, label } = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, label, position);
    },
    [screenToFlowPosition, addNode],
  );

  const handlePaneClick = useCallback(
    () => setSelectedNodeId(null),
    [setSelectedNodeId],
  );

  const isEmpty = nodes.length === 0;

  return (
    <main
      aria-label="Architecture canvas"
      className="relative flex-1 h-full"
    >
      {/* Floating toolbar */}
      <Toolbar />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={handlePaneClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-gray-950"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgb(100 116 139 / 0.25)"
        />
        <Controls
          showInteractive={false}
          className="!bg-gray-800 !border-gray-700 !shadow-lg [&>button]:!bg-gray-800 [&>button]:!border-gray-700 [&>button]:!fill-gray-300 [&>button:hover]:!bg-gray-700"
        />
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            if (node.type === 'stickyNote') return '#fbbf24';
            if (node.type?.startsWith('aws')) return '#fb923c';
            if (node.type?.startsWith('gcp')) return '#60a5fa';
            if (node.type?.startsWith('azure')) return '#22d3ee';
            if (node.type?.startsWith('k8s')) return '#818cf8';
            if (node.type?.startsWith('shape')) return '#94a3b8';
            return '#6366f1';
          }}
          maskColor="rgb(3 7 18 / 0.7)"
          className="!bg-gray-900 !border-gray-700"
        />
      </ReactFlow>

      {/* Empty-state overlay with fade animation */}
      <AnimatePresence>
        {isEmpty && (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <div className="text-center select-none">
              <h2 className="text-lg font-medium text-gray-400">
                Your canvas is empty
              </h2>
              <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
                Drag components from the left panel and drop them here to start
                designing your system architecture.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default Canvas;
