/**
 * Toolbar — Floating toolbar above the canvas.
 *
 * Contains action buttons for:
 *   • Export as PNG / SVG
 *   • Save (manual, project-scoped)
 *   • Undo / Redo
 *   • Edge routing toggle
 *   • Zoom to fit
 *   • Keyboard shortcuts
 */
import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import {
  Image,
  FileCode,
  Undo2,
  Redo2,
  Maximize,
  Spline,
  CornerDownRight,
  Keyboard,
} from 'lucide-react';
import useCanvasStore from '../store/useCanvasStore';
import toast from 'react-hot-toast';

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

function Toolbar({ projectId, onCanvasChange }) {
  const { fitView } = useReactFlow();
  const edgeType = useCanvasStore((s) => s.edgeType);
  const setEdgeType = useCanvasStore((s) => s.setEdgeType);
  const undo = useCanvasStore((s) => s.undo);
  const redo = useCanvasStore((s) => s.redo);
  const canUndo = useCanvasStore((s) => s.pastStates.length > 0);
  const canRedo = useCanvasStore((s) => s.futureStates.length > 0);

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
      toast.success('Exported as PNG');
    } catch {
      toast.error('Export failed');
    }
  }, [getFlowElement]);

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
      toast.success('Exported as SVG');
    } catch {
      toast.error('Export failed');
    }
  }, [getFlowElement]);

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 300 });
  }, [fitView]);

  const handleUndo = useCallback(() => {
    undo();
    if (onCanvasChange) onCanvasChange();
  }, [undo, onCanvasChange]);

  const handleRedo = useCallback(() => {
    redo();
    if (onCanvasChange) onCanvasChange();
  }, [redo, onCanvasChange]);

  const handleEdgeToggle = useCallback(() => {
    setEdgeType(edgeType === 'smoothstep' ? 'step' : 'smoothstep');
    if (onCanvasChange) onCanvasChange();
  }, [edgeType, setEdgeType, onCanvasChange]);

  return (
    <div
      className="
        absolute top-3 left-1/2 -translate-x-1/2 z-20
        flex items-center gap-1 px-2 py-1.5
        rounded-xl border border-gray-700/60
        bg-gray-900/90 backdrop-blur-md shadow-2xl
      "
    >
      {/* Export */}
      <ToolBtn onClick={handleExportPNG} title="Export as PNG (⌘E)">
        <Image className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn onClick={handleExportSVG} title="Export as SVG">
        <FileCode className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Undo / Redo */}
      <ToolBtn onClick={handleUndo} title="Undo (⌘Z)" disabled={!canUndo}>
        <Undo2 className="h-4 w-4" />
      </ToolBtn>
      <ToolBtn onClick={handleRedo} title="Redo (⌘⇧Z)" disabled={!canRedo}>
        <Redo2 className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Edge Routing Toggle */}
      <ToolBtn
        onClick={handleEdgeToggle}
        title={`Routing: ${edgeType === 'step' ? 'Orthogonal' : 'Smooth'}`}
      >
        {edgeType === 'step' ? <CornerDownRight className="h-4 w-4" /> : <Spline className="h-4 w-4" />}
      </ToolBtn>

      <Divider />

      {/* Fit view */}
      <ToolBtn onClick={handleFitView} title="Zoom to Fit (⌘1)">
        <Maximize className="h-4 w-4" />
      </ToolBtn>

      <Divider />

      {/* Keyboard shortcuts */}
      <ToolBtn onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: '?' }))} title="Keyboard Shortcuts (?)">
        <Keyboard className="h-4 w-4" />
      </ToolBtn>
    </div>
  );
}

export default Toolbar;
