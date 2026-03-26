/**
 * Canvas (Center Panel)
 *
 * Hosts the React Flow instance wired to the Zustand store.
 * Handles native HTML5 drop events from the Sidebar palette.
 * Includes the floating Toolbar and MiniMap.
 */
import { useCallback, useMemo, useState, useEffect } from 'react';
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
import TabBar from './TabBar';
import ContextMenu from './ContextMenu';
import AlignmentToolbar from './AlignmentToolbar';

/** MIME type used as the drag-and-drop data channel. */
const DND_MIME = 'application/systemcanvas-node';

function Canvas() {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const edgeType = useCanvasStore((s) => s.edgeType);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const setSelectedNodeId = useCanvasStore((s) => s.setSelectedNodeId);

  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();
  const [menu, setMenu] = useState(null);

  /** Global Keyboard Shortcuts for Pro Features */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if writing in an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        useCanvasStore.getState().duplicateSelected();
      }
      
      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        useCanvasStore.getState().selectAll();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /** Fallback styles applied to every new edge unless overridden. */
  const defaultEdgeOptions = useMemo(() => ({
    type: edgeType,
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }), [edgeType]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleNodeDragStop = useCallback((event, node) => {
    // Avoid dropping a group into another group currently to keep it simple
    if (node.type === 'groupBlock') return;

    const intersections = getIntersectingNodes(node).filter((n) => n.type === 'groupBlock');
    const groupNode = intersections.length > 0 ? intersections[0] : null;

    if (groupNode && node.parentNode !== groupNode.id) {
      // Assign to group
      useCanvasStore.getState().reparentNode(node.id, groupNode.id);
    } else if (!groupNode && node.parentNode) {
      // Remove from group
      useCanvasStore.getState().reparentNode(node.id, null);
    }
  }, [getIntersectingNodes]);

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
    () => {
      setSelectedNodeId(null);
      setMenu(null);
    },
    [setSelectedNodeId],
  );

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault(); // Prevent native right-click menu
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
    },
    [setMenu],
  );

  const isEmpty = nodes.length === 0;

  return (
    <main
      aria-label="Architecture canvas"
      className="relative flex-1 h-full"
    >
      {/* Floating toolbars */}
      <Toolbar />
      <AlignmentToolbar />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={handlePaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={(e) => { e.preventDefault(); setMenu(null); }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={edgeType === 'step' ? ConnectionLineType.Step : ConnectionLineType.SmoothStep}
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

      {/* Workspace Tabs */}
      <TabBar />

      {/* Context Menu */}
      {menu && <ContextMenu onClick={() => setMenu(null)} {...menu} />}
    </main>
  );
}

export default Canvas;
