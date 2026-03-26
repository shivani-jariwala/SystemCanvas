/**
 * useCanvasStore — central Zustand store for all React Flow state.
 *
 * Holds nodes, edges, and the currently selected node ID.
 * Exposes actions consumed by the Canvas, Sidebar (drag-drop),
 * and Inspector (property editing) components.
 *
 * React Flow requires its own change-handler pattern: every drag,
 * selection, or deletion fires an array of granular "changes" that
 * must be applied immutably via applyNodeChanges / applyEdgeChanges.
 */
import { create } from 'zustand';
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  MarkerType,
} from '@xyflow/react';

/** Monotonically increasing counter for deterministic node IDs. */
let nextNodeId = 1;

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

  /* ------------------------------------------------------------------ */
  /*  React Flow change handlers                                        */
  /* ------------------------------------------------------------------ */

  /**
   * Called by <ReactFlow onNodesChange>.
   * Applies position / selection / dimension / removal deltas.
   * Also syncs selectedNodeId when a node is selected or deselected.
   */
  onNodesChange: (changes) => {
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
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },

  /**
   * Called by <ReactFlow onConnect>.
   * Creates a new animated edge with an arrow marker between two handles.
   */
  onConnect: (connection) => {
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
    const id = `node-${nextNodeId++}`;
    const newNode = {
      id,
      type: nodeType,
      position,
      data: {
        label,
        status: 'healthy',
        latency: 0,
      },
    };
    set((state) => ({ nodes: [...state.nodes, newNode] }));
  },

  /**
   * Merges new data into an existing node's `data` object.
   * Used by the Inspector panel to update label, latency, etc.
   *
   * @param {string} nodeId — target node ID
   * @param {object} data   — partial data to merge
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

  /**
   * Returns the full node object for the currently selected node,
   * or null if nothing is selected.
   */
  getSelectedNode: () => {
    const { nodes, selectedNodeId } = get();
    if (!selectedNodeId) return null;
    return nodes.find((n) => n.id === selectedNodeId) ?? null;
  },
}));

export default useCanvasStore;
