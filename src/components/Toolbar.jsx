/**
 * Toolbar — Floating toolbar above the canvas.
 *
 * Contains action buttons for:
 *   • Export as PNG / SVG
 *   • Save / Load diagrams (localStorage)
 *   • Undo / Redo
 *   • Zoom to fit
 */
import { useCallback, useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import {
  Download,
  Image,
  FileCode,
  Save,
  FolderOpen,
  Undo2,
  Redo2,
  Maximize,
  Check,
  AlertCircle,
} from 'lucide-react';
import useCanvasStore from '../store/useCanvasStore';

/** Tooltip wrapper */
function ToolBtn({ onClick, title, children, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        relative flex items-center justify-center
        h-8 w-8 rounded-lg
        transition-all duration-150
        ${disabled
          ? 'text-gray-600 cursor-not-allowed'
          : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/60 active:scale-95'}
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-gray-700/60 mx-0.5" />;
}

/** Toast notification */
function Toast({ message, type }) {
  return (
    <div
      className={`
        fixed top-4 right-4 z-50
        flex items-center gap-2 px-4 py-2.5
        rounded-lg shadow-xl border backdrop-blur-sm
        animate-[slideIn_0.3s_ease-out]
        ${type === 'success'
          ? 'bg-emerald-900/90 border-emerald-700/60 text-emerald-200'
          : 'bg-red-900/90 border-red-700/60 text-red-200'}
      `}
    >
      {type === 'success' ? (
        <Check className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

const STORAGE_KEY = 'systemcanvas-diagram';

function Toolbar() {
  const { fitView, getViewport } = useReactFlow();
  const nodes = useCanvasStore((s) => s.nodes);
  const edges = useCanvasStore((s) => s.edges);
  const setNodes = useCanvasStore((s) => s.setNodes);
  const setEdges = useCanvasStore((s) => s.setEdges);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const canUndo = useCanvasStore((s) => s.pastStates.length > 0);
  const canRedo = useCanvasStore((s) => s.futureStates.length > 0);

  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  /** Get the React Flow viewport element for image export */
  const getFlowElement = useCallback(() => {
    return document.querySelector('.react-flow__viewport');
  }, []);

  const handleExportPNG = useCallback(async () => {
    const el = getFlowElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: '#030712',
        quality: 1,
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = 'system-architecture.png';
      link.href = dataUrl;
      link.click();
      showToast('Exported as PNG');
    } catch {
      showToast('Export failed', 'error');
    }
  }, [getFlowElement, showToast]);

  const handleExportSVG = useCallback(async () => {
    const el = getFlowElement();
    if (!el) return;
    try {
      const dataUrl = await toSvg(el, {
        backgroundColor: '#030712',
      });
      const link = document.createElement('a');
      link.download = 'system-architecture.svg';
      link.href = dataUrl;
      link.click();
      showToast('Exported as SVG');
    } catch {
      showToast('Export failed', 'error');
    }
  }, [getFlowElement, showToast]);

  const handleSave = useCallback(() => {
    const data = { nodes, edges, viewport: getViewport() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    showToast('Diagram saved');
  }, [nodes, edges, getViewport, showToast]);

  const handleLoad = useCallback(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      showToast('No saved diagram found', 'error');
      return;
    }
    try {
      const { nodes: savedNodes, edges: savedEdges } = JSON.parse(raw);
      setNodes(savedNodes || []);
      setEdges(savedEdges || []);
      showToast('Diagram loaded');
    } catch {
      showToast('Failed to load diagram', 'error');
    }
  }, [setNodes, setEdges, showToast]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  return (
    <>
      <div
        className="
          absolute top-3 left-1/2 -translate-x-1/2 z-20
          flex items-center gap-1 px-2 py-1.5
          rounded-xl border border-gray-700/60
          bg-gray-900/90 backdrop-blur-md shadow-2xl
        "
      >
        {/* Export */}
        <ToolBtn onClick={handleExportPNG} title="Export as PNG">
          <Image className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={handleExportSVG} title="Export as SVG">
          <FileCode className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Save / Load */}
        <ToolBtn onClick={handleSave} title="Save diagram">
          <Save className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={handleLoad} title="Load diagram">
          <FolderOpen className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Undo / Redo */}
        <ToolBtn onClick={undo} title="Undo" disabled={!canUndo}>
          <Undo2 className="h-4 w-4" />
        </ToolBtn>
        <ToolBtn onClick={redo} title="Redo" disabled={!canRedo}>
          <Redo2 className="h-4 w-4" />
        </ToolBtn>

        <Divider />

        {/* Fit view */}
        <ToolBtn onClick={handleFitView} title="Fit to view">
          <Maximize className="h-4 w-4" />
        </ToolBtn>
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default Toolbar;
