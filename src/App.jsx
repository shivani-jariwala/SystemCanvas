import { ReactFlowProvider } from '@xyflow/react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import Inspector from './components/Inspector';
import LoginPage from './components/LoginPage';
import useAuthStore from './store/useAuthStore';

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

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
