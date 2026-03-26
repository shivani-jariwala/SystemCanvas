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
  /*  Pages (Tabs) State                                                 */
  /* ------------------------------------------------------------------ */
  pages: [{ id: 'page-1', name: 'Page 1', nodes: [], edges: [], pastStates: [], futureStates: [] }],
  activePageId: 'page-1',

  /* ------------------------------------------------------------------ */
  /*  Active Page State                                                  */
  /* ------------------------------------------------------------------ */

  /** @type {import('@xyflow/react').Node[]} */
  nodes: [],

  /** @type {import('@xyflow/react').Edge[]} */
  edges: [],

  edgeType: 'smoothstep',

  /** ID of the node currently selected for inspection (null = none). */
  selectedNodeId: null,

  /** Undo/Redo history stacks */
  pastStates: [],
  futureStates: [],

  /* ------------------------------------------------------------------ */
  /*  History & Page Helpers                                              */
  /* ------------------------------------------------------------------ */

  _syncActivePage: () => {
    const { activePageId, nodes, edges, pastStates, futureStates, pages } = get();
    const updatedPages = pages.map(p => 
      p.id === activePageId 
        ? { ...p, nodes, edges, pastStates, futureStates, edgeType: get().edgeType } 
        : p
    );
    set({ pages: updatedPages });
    return updatedPages;
  },

  switchPage: (targetId) => {
    const { activePageId, pages } = get();
    if (targetId === activePageId) return;
    
    // Sync current active page to array
    get()._syncActivePage();
    
    // Load new page into active root
    const targetPage = get().pages.find(p => p.id === targetId);
    if (targetPage) {
      set({
        activePageId: targetId,
        nodes: targetPage.nodes || [],
        edges: targetPage.edges || [],
        edgeType: targetPage.edgeType || 'smoothstep',
        pastStates: targetPage.pastStates || [],
        futureStates: targetPage.futureStates || [],
        selectedNodeId: null
      });
    }
  },

  createPage: (name) => {
    get()._syncActivePage();
    const newPage = {
      id: `page-${Date.now()}`,
      name: name || `Page ${get().pages.length + 1}`,
      nodes: [],
      edges: [],
      pastStates: [],
      futureStates: []
    };
    
    set((state) => ({
      pages: [...state.pages, newPage],
      activePageId: newPage.id,
      nodes: [],
      edges: [],
      edgeType: 'smoothstep',
      pastStates: [],
      futureStates: [],
      selectedNodeId: null
    }));
  },

  renamePage: (id, name) => {
    set((state) => ({
      pages: state.pages.map(p => p.id === id ? { ...p, name } : p)
    }));
  },

  deletePage: (id) => {
    const { pages, activePageId } = get();
    if (pages.length <= 1) return; // Cannot delete last page
    
    get()._syncActivePage();
    const newPages = get().pages.filter(p => p.id !== id);
    
    if (activePageId === id) {
      // Swapping to the first available page
      const targetPage = newPages[0];
      set({
        pages: newPages,
        activePageId: targetPage.id,
        nodes: targetPage.nodes || [],
        edges: targetPage.edges || [],
        edgeType: targetPage.edgeType || 'smoothstep',
        pastStates: targetPage.pastStates || [],
        futureStates: targetPage.futureStates || [],
        selectedNodeId: null
      });
    } else {
      set({ pages: newPages });
    }
  },

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

  setEdgeType: (type) => {
    get()._pushHistory();
    set((state) => ({
      edgeType: type,
      edges: state.edges.map(e => ({ ...e, type }))
    }));
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
          type: state.edgeType || 'smoothstep',
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
   * Node Context Menu Actions
   */
  duplicateNode: (id) => {
    get()._pushHistory();
    const { nodes } = get();
    const nodeToCopy = nodes.find((n) => n.id === id);
    if (!nodeToCopy) return;

    const newId = `node-${nextNodeId++}`;
    const newNode = {
      ...nodeToCopy,
      id: newId,
      position: { x: nodeToCopy.position.x + 50, y: nodeToCopy.position.y + 50 },
      selected: true,
    };

    set({
      nodes: [...nodes.map((n) => ({ ...n, selected: false })), newNode],
      selectedNodeId: newId,
    });
  },

  deleteNode: (id) => {
    get()._pushHistory();
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== id),
      edges: state.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
    }));
  },

  bringToFront: (id) => {
    get()._pushHistory();
    const { nodes } = get();
    const maxZ = Math.max(0, ...nodes.map((n) => n.zIndex || 0));
    set({
      nodes: nodes.map((n) => (n.id === id ? { ...n, zIndex: maxZ + 1 } : n)),
    });
  },

  sendToBack: (id) => {
    get()._pushHistory();
    const { nodes } = get();
    const minZ = Math.min(0, ...nodes.map((n) => n.zIndex || 0));
    set({
      nodes: nodes.map((n) => (n.id === id ? { ...n, zIndex: minZ - 1 } : n)),
    });
  },

  /**
   * Multi-Node Actions (Shortcuts & Alignment)
   */
  duplicateSelected: () => {
    get()._pushHistory();
    const { nodes } = get();
    const selectedNodes = nodes.filter(n => n.selected);
    if (selectedNodes.length === 0) return;

    const newNodes = selectedNodes.map(node => ({
      ...node,
      id: `node-${nextNodeId++}`,
      position: { x: node.position.x + 50, y: node.position.y + 50 },
      selected: true
    }));

    set({
      nodes: [
        ...nodes.map(n => ({ ...n, selected: false })),
        ...newNodes
      ]
    });
  },

  selectAll: () => {
    set((state) => ({
      nodes: state.nodes.map(n => ({ ...n, selected: true })),
      edges: state.edges.map(e => ({ ...e, selected: true }))
    }));
  },

  alignSelected: (alignment) => {
    get()._pushHistory();
    const { nodes } = get();
    const selected = nodes.filter(n => n.selected);
    if (selected.length < 2) return;

    // Approximated bounds since measured data might be missing immediately on load
    const minX = Math.min(...selected.map(n => n.position.x));
    const maxX = Math.max(...selected.map(n => n.position.x + (n.measured?.width || 150)));
    const minY = Math.min(...selected.map(n => n.position.y));
    const maxY = Math.max(...selected.map(n => n.position.y + (n.measured?.height || 50)));

    set({
      nodes: nodes.map(n => {
        if (!n.selected) return n;
        const w = n.measured?.width || 150;
        const h = n.measured?.height || 50;
        let x = n.position.x;
        let y = n.position.y;

        switch (alignment) {
          case 'left': x = minX; break;
          case 'center': x = minX + (maxX - minX) / 2 - w / 2; break;
          case 'right': x = maxX - w; break;
          case 'top': y = minY; break;
          case 'middle': y = minY + (maxY - minY) / 2 - h / 2; break;
          case 'bottom': y = maxY - h; break;
        }
        return { ...n, position: { x, y } };
      })
    });
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
   * Parenting / Grouping Logic
   */
  reparentNode: (nodeId, newParentId) => {
    get()._pushHistory();
    const { nodes } = get();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    if (newParentId) {
      const parent = nodes.find((n) => n.id === newParentId);
      if (parent) {
        // Convert to relative position
        const relativeX = node.position.x - parent.position.x;
        const relativeY = node.position.y - parent.position.y;
        
        set({
          nodes: nodes.map((n) => (n.id === nodeId ? { 
            ...n, 
            parentNode: newParentId, 
            position: { x: relativeX, y: relativeY } 
          } : n)),
        });
      }
    } else {
      // Removing from parent => Convert back to absolute position
      const parent = nodes.find((n) => n.id === node.parentNode);
      if (parent) {
        const absX = node.position.x + parent.position.x;
        const absY = node.position.y + parent.position.y;
        
        set({
          nodes: nodes.map((n) => (n.id === nodeId ? { 
            ...n, 
            parentNode: undefined, 
            position: { x: absX, y: absY } 
          } : n)),
        });
      }
    }
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
