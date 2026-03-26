/**
 * useCanvasStore — central Zustand store for all React Flow state.
 *
 * Holds nodes, edges, the currently selected node ID, and undo/redo history.
 * Exposes actions consumed by the Canvas, Sidebar (drag-drop),
 * Inspector (property editing), and Toolbar (save/load/undo/redo).
 */
import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import NODE_TYPES from '../constants/nodeTypes';

/** Monotonically increasing counter for deterministic node IDs. */
let nextNodeId = 1;

/** Max undo history size */
const MAX_HISTORY = 50;

const useCanvasStore = create((set, get) => ({
  /* ------------------------------------------------------------------ */
  /*  State                                                              */
  /* ------------------------------------------------------------------ */

  /** @type {import('@xyflow/react').Node[]} */
  nodes: [],

  /** @type {import('@xyflow/react').Edge[]} */
  edges: [],

  /** ID of the node currently selected for inspection (null = none). */
  selectedNodeId: null,

  /** Undo/Redo history stacks */
  pastStates: [],
  futureStates: [],

  /* ------------------------------------------------------------------ */
  /*  History helpers                                                     */
  /* ------------------------------------------------------------------ */

  /** Push current state to undo stack before a mutation */
  _pushHistory: () => {
    const { nodes, edges, pastStates } = get();
    const snapshot = { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) };
    set({
      pastStates: [...pastStates.slice(-MAX_HISTORY), snapshot],
      futureStates: [],
    });
  },

  undo: () => {
    const { pastStates, nodes, edges } = get();
    if (pastStates.length === 0) return;
    const prev = pastStates[pastStates.length - 1];
    set({
      nodes: prev.nodes,
      edges: prev.edges,
      pastStates: pastStates.slice(0, -1),
      futureStates: [{ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }, ...get().futureStates],
      selectedNodeId: null,
    });
  },

  redo: () => {
    const { futureStates, nodes, edges } = get();
    if (futureStates.length === 0) return;
    const next = futureStates[0];
    set({
      nodes: next.nodes,
      edges: next.edges,
      futureStates: futureStates.slice(1),
      pastStates: [...get().pastStates, { nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) }],
      selectedNodeId: null,
    });
  },

  /* ------------------------------------------------------------------ */
  /*  Bulk setters (for save/load)                                       */
  /* ------------------------------------------------------------------ */

  setNodes: (nodes) => {
    get()._pushHistory();
    set({ nodes, selectedNodeId: null });
  },

  setEdges: (edges) => {
    get()._pushHistory();
    set({ edges });
  },

  /* ------------------------------------------------------------------ */
  /*  React Flow change handlers                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Called by <ReactFlow onNodesChange>.
   * Applies position / selection / dimension / removal deltas.
   * Also syncs selectedNodeId when a node is selected or deselected.
   */
  onNodesChange: (changes) => {
    // Push history for removal changes
    const hasRemoval = changes.some((c) => c.type === 'remove');
    if (hasRemoval) get()._pushHistory();

    set((state) => {
      const updatedNodes = applyNodeChanges(changes, state.nodes);

      /* Derive selectedNodeId from the selection changes */
      let { selectedNodeId } = state;
      for (const change of changes) {
        if (change.type === 'select') {
          selectedNodeId = change.selected ? change.id : null;
        }
        if (change.type === 'remove' && change.id === selectedNodeId) {
          selectedNodeId = null;
        }
      }

      return { nodes: updatedNodes, selectedNodeId };
    });
  },

  /**
   * Called by <ReactFlow onEdgesChange>.
   * Applies selection / removal deltas to edges.
   */
  onEdgesChange: (changes) => {
    const hasRemoval = changes.some((c) => c.type === 'remove');
    if (hasRemoval) get()._pushHistory();

    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  /**
   * Called by <ReactFlow onConnect>.
   * Creates a new animated edge with an arrow marker between two handles.
   */
  onConnect: (connection) => {
    get()._pushHistory();
    set((state) => ({
      edges: addEdge(
        {
          ...connection,
          animated: true,
          type: 'smoothstep',
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
            width: 20,
            height: 20,
          },
        },
        state.edges,
      ),
    }));
  },

  /* ------------------------------------------------------------------ */
  /*  Custom actions                                                     */
  /* ------------------------------------------------------------------ */

  /**
   * Adds a brand-new node to the canvas.
   *
   * @param {string}  nodeType   — key from NODE_TYPES (e.g. 'apiGateway')
   * @param {string}  label      — display name (defaults to nodeType label)
   * @param {{x:number,y:number}} position — canvas coordinates
   */
  addNode: (nodeType, label, position) => {
    get()._pushHistory();
    const id = `node-${nextNodeId++}`;
    const typeDef = NODE_TYPES.find((t) => t.type === nodeType);

    // Build data based on node type
    const data = { label, status: 'healthy', latency: 0 };

    // Shape nodes need shape data
    if (typeDef?.shape) {
      data.shape = typeDef.shape;
    }

    // Table nodes start with initial rows
    if (nodeType === 'tableBlock') {
      data.mode = 'table';
      data.rows = [{ key: 'Key', value: 'Value' }];
    }

    // Text blocks
    if (nodeType === 'textBlock') {
      data.mode = 'text';
      data.body = '';
    }

    // Sticky notes default color
    if (nodeType === 'stickyNote') {
      data.color = 'yellow';
    }

    const newNode = { id, type: nodeType, position, data };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  /**
   * Merges new data into an existing node's `data` object.
   * Used by the Inspector panel to update label, latency, etc.
   */
  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node,
      ),
    }));
  },

  /**
   * Explicitly set the selected node (used when clicking the canvas
   * background to deselect, or when programmatically selecting).
   */
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),

  /* ------------------------------------------------------------------ */
  /*  Derived / convenience getters                                      */
  /* ------------------------------------------------------------------ */

  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  },
}));

export default useCanvasStore;
