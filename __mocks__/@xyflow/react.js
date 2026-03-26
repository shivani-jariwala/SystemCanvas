/**
 * Jest mock for @xyflow/react.
 *
 * Provides lightweight stubs for every export the app uses so that
 * component-level tests can render without the full React Flow runtime
 * (which requires canvas measurement APIs not available in jsdom).
 */

/* Re-export the real pure-logic helpers the store depends on */
const actual = jest.requireActual('@xyflow/react');

module.exports = {
  ...actual,

  /* Replace heavy components with simple pass-through wrappers */
  ReactFlow: ({ children }) => children,
  ReactFlowProvider: ({ children }) => children,
  Background: () => null,
  Controls: () => null,

  /* Stub the hook — screenToFlowPosition just returns the input */
  useReactFlow: () => ({
    screenToFlowPosition: (pos) => pos,
  }),

  /* Enum re-exports (used in component props) */
  BackgroundVariant: actual.BackgroundVariant,
  ConnectionLineType: actual.ConnectionLineType ?? {},
  Position: actual.Position,
  MarkerType: actual.MarkerType,

  /* The real helpers for store tests */
  applyNodeChanges: actual.applyNodeChanges,
  applyEdgeChanges: actual.applyEdgeChanges,
  addEdge: actual.addEdge,
  Handle: ({ children }) => children ?? null,
};
