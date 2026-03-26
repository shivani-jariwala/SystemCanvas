/**
 * App — Root component for SystemCanvas.
 *
 * Renders the full-viewport three-panel layout:
 *   Left   → Sidebar  (component palette)
 *   Center → Canvas   (React Flow workspace)
 *   Right  → Inspector (node property editor)
 *
 * ReactFlowProvider wraps the entire app so that React Flow hooks
 * (e.g. useReactFlow) are available in any descendant component,
 * including the Sidebar's drop handler in Step 5.
 */
import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';

function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-gray-100">
        <Sidebar />
        <Canvas />
        <Inspector />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
