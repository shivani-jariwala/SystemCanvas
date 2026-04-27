/**
 * Canvas (Center Panel)
 *
 * Hosts the React Flow instance wired to the Zustand store.
 * Handles native HTML5 drop events from the Sidebar palette.
 * Includes the floating Toolbar and MiniMap.
 * Now supports permission-awareness and keyboard shortcuts modal.
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
import useToolUsageStore from '../store/useToolUsageStore';
import nodeTypes from './nodes';
import Toolbar from './Toolbar';
import TabBar from './TabBar';
import ContextMenu from './ContextMenu';
import AlignmentToolbar from './AlignmentToolbar';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

/** MIME type used as the drag-and-drop data channel. */
const DND_MIME = 'application/systemcanvas-node';

function Canvas({ projectId, isReadOnly = false, onCanvasChange }) {
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const edgeType = useCanvasStore((s) => s.edgeType);
  const onNodesChange = useCanvasStore((s) => s.onNodesChange);
  const onEdgesChange = useCanvasStore((s) => s.onEdgesChange);
  const onConnect = useCanvasStore((s) => s.onConnect);
  const addNode = useCanvasStore((s) => s.addNode);
  const setSelectedNodeId = useCanvasStore((s) => s.setSelectedNodeId);
  const addRecentTool = useToolUsageStore((s) => s.addRecentTool);

  const { screenToFlowPosition, getIntersectingNodes, fitView } = useReactFlow();
  const [menu, setMenu] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);

  /** Global Keyboard Shortcuts */
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore shortcuts if writing in an input/textarea
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (!isReadOnly) useCanvasStore.getState().duplicateSelected();
      }

      if (cmdOrCtrl && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        useCanvasStore.getState().selectAll();
      }

      // Zoom to fit: ⌘1
      if (cmdOrCtrl && e.key === '1') {
        e.preventDefault();
        fitView({ padding: 0.2, duration: 300 });
      }

      // Show shortcuts: ?
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      }

      // Escape
      if (e.key === 'Escape') {
        setMenu(null);
        setShowShortcuts(false);
        setSelectedNodeId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fitView, isReadOnly, setSelectedNodeId]);

  /** Fallback styles applied to every new edge. */
  const defaultEdgeOptions = useMemo(() => ({
    type: edgeType,
    animated: true,
    style: { stroke: '#6366f1', strokeWidth: 2 },
  }), [edgeType]);

  const handleDragOver = useCallback((event) => {
    if (isReadOnly) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, [isReadOnly]);

  const handleNodeDragStop = useCallback((event, node) => {
    if (isReadOnly) return;
    if (node.type === 'groupBlock') return;

    const intersections = getIntersectingNodes(node).filter((n) => n.type === 'groupBlock');
    const groupNode = intersections.length > 0 ? intersections[0] : null;

    if (groupNode && node.parentNode !== groupNode.id) {
      useCanvasStore.getState().reparentNode(node.id, groupNode.id);
    } else if (!groupNode && node.parentNode) {
      useCanvasStore.getState().reparentNode(node.id, null);
    }

    if (onCanvasChange) onCanvasChange();
  }, [getIntersectingNodes, isReadOnly, onCanvasChange]);

  const handleDrop = useCallback(
    (event) => {
      if (isReadOnly) return;
      event.preventDefault();
      const raw = event.dataTransfer.getData(DND_MIME);
      if (!raw) return;

      const { type, label } = JSON.parse(raw);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      addNode(type, label, position);
      addRecentTool(type);
      if (onCanvasChange) onCanvasChange();
    },
    [screenToFlowPosition, addNode, addRecentTool, isReadOnly, onCanvasChange],
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
      event.preventDefault();
      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
      });
    },
    [],
  );

  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    if (onCanvasChange && changes.some((c) => c.type === 'position' || c.type === 'remove' || c.type === 'dimensions')) {
      onCanvasChange();
    }
  }, [onNodesChange, onCanvasChange]);

  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
    if (onCanvasChange && changes.some((c) => c.type === 'remove')) {
      onCanvasChange();
    }
  }, [onEdgesChange, onCanvasChange]);

  const handleConnect = useCallback((connection) => {
    onConnect(connection);
    if (onCanvasChange) onCanvasChange();
  }, [onConnect, onCanvasChange]);

  const isEmpty = nodes.length === 0;

  return (
    <main
      aria-label="Architecture canvas"
      className="relative flex-1 h-full"
    >
      {/* Floating toolbars */}
      {!isReadOnly && <Toolbar projectId={projectId} onCanvasChange={onCanvasChange} />}
      {!isReadOnly && <AlignmentToolbar />}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={isReadOnly ? undefined : handleConnect}
        onNodeDragStop={handleNodeDragStop}
        onPaneClick={handlePaneClick}
        onNodeContextMenu={isReadOnly ? undefined : onNodeContextMenu}
        onPaneContextMenu={(e) => { e.preventDefault(); setMenu(null); }}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineType={edgeType === 'step' ? ConnectionLineType.Step : ConnectionLineType.SmoothStep}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        nodesDraggable={!isReadOnly}
        nodesConnectable={!isReadOnly}
        elementsSelectable={true}
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

      {/* Empty-state overlay */}
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
                {isReadOnly ? 'This canvas is empty' : 'Your canvas is empty'}
              </h2>
              <p className="mt-1 text-sm text-gray-500 max-w-xs mx-auto">
                {isReadOnly
                  ? 'No components have been added to this canvas yet.'
                  : 'Drag components from the left panel or click to add them to the canvas.'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workspace Tabs */}
      {!isReadOnly && <TabBar />}

      {/* Context Menu */}
      {menu && !isReadOnly && <ContextMenu onClick={() => setMenu(null)} {...menu} />}

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Read-only indicator */}
      {isReadOnly && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-gray-800/80 backdrop-blur-md rounded-lg border border-gray-700/60 text-xs text-gray-400 font-medium">
          👁 View-only mode — You don't have permission to edit this project
        </div>
      )}
    </main>
  );
}

export default Canvas;
