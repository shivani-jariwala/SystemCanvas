/**
 * Unit tests for the Zustand canvas store.
 *
 * These exercise the core state actions (addNode, updateNodeData,
 * onConnect, selection) in isolation — no React rendering required.
 */
import useCanvasStore from '../store/useCanvasStore';

/** Reset the store to a clean slate before every test. */
beforeEach(() => {
  useCanvasStore.setState({ nodes: [], edges: [], selectedNodeId: null });
});

describe('useCanvasStore', () => {
  // ----- addNode ---------------------------------------------------------

  it('adds a node with correct type, label, position, and default data', () => {
    const { addNode } = useCanvasStore.getState();

    addNode('apiGateway', 'My Gateway', { x: 100, y: 200 });

    const { nodes } = useCanvasStore.getState();
    expect(nodes).toHaveLength(1);

    const node = nodes[0];
    expect(node.type).toBe('apiGateway');
    expect(node.position).toEqual({ x: 100, y: 200 });
    expect(node.data).toEqual({
      label: 'My Gateway',
      status: 'healthy',
      latency: 0,
    });
    expect(node.id).toMatch(/^node-\d+$/);
  });

  it('assigns unique IDs to successive nodes', () => {
    const { addNode } = useCanvasStore.getState();

    addNode('database', 'DB 1', { x: 0, y: 0 });
    addNode('cache', 'Cache 1', { x: 50, y: 50 });

    const { nodes } = useCanvasStore.getState();
    expect(nodes).toHaveLength(2);
    expect(nodes[0].id).not.toBe(nodes[1].id);
  });

  // ----- updateNodeData --------------------------------------------------

  it('merges partial data into an existing node', () => {
    const { addNode } = useCanvasStore.getState();
    addNode('microservice', 'Auth Service', { x: 0, y: 0 });

    const nodeId = useCanvasStore.getState().nodes[0].id;

    useCanvasStore.getState().updateNodeData(nodeId, {
      label: 'Auth v2',
      latency: 120,
    });

    const updated = useCanvasStore.getState().nodes[0];
    expect(updated.data.label).toBe('Auth v2');
    expect(updated.data.latency).toBe(120);
    expect(updated.data.status).toBe('healthy');
  });

  // ----- onConnect -------------------------------------------------------

  it('creates an animated edge between two nodes', () => {
    const { addNode } = useCanvasStore.getState();
    addNode('apiGateway', 'Gateway', { x: 0, y: 0 });
    addNode('microservice', 'Service', { x: 200, y: 200 });

    const [src, tgt] = useCanvasStore.getState().nodes;

    useCanvasStore.getState().onConnect({
      source: src.id,
      target: tgt.id,
      sourceHandle: null,
      targetHandle: null,
    });

    const { edges } = useCanvasStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe(src.id);
    expect(edges[0].target).toBe(tgt.id);
    expect(edges[0].animated).toBe(true);
  });

  // ----- selection -------------------------------------------------------

  it('tracks the selected node ID', () => {
    const { addNode, setSelectedNodeId } = useCanvasStore.getState();
    addNode('database', 'Users DB', { x: 0, y: 0 });

    const nodeId = useCanvasStore.getState().nodes[0].id;
    setSelectedNodeId(nodeId);
    expect(useCanvasStore.getState().selectedNodeId).toBe(nodeId);

    setSelectedNodeId(null);
    expect(useCanvasStore.getState().selectedNodeId).toBeNull();
  });

  it('returns the full node object via getSelectedNode', () => {
    const { addNode, setSelectedNodeId } = useCanvasStore.getState();
    addNode('cache', 'Redis', { x: 10, y: 20 });

    const nodeId = useCanvasStore.getState().nodes[0].id;
    setSelectedNodeId(nodeId);

    const selected = useCanvasStore.getState().getSelectedNode();
    expect(selected).not.toBeNull();
    expect(selected.data.label).toBe('Redis');
  });
});
