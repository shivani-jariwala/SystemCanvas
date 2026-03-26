import { Copy, Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import useCanvasStore from '../store/useCanvasStore';

function ContextMenu({ id, top, left, onClick }) {
  const duplicateNode = useCanvasStore((s) => s.duplicateNode);
  const deleteNode = useCanvasStore((s) => s.deleteNode);
  const bringToFront = useCanvasStore((s) => s.bringToFront);
  const sendToBack = useCanvasStore((s) => s.sendToBack);

  return (
    <div
      style={{ top, left }}
      className="fixed z-50 min-w-[170px] bg-gray-900 border border-gray-700/80 rounded-lg shadow-2xl overflow-hidden py-1.5 text-sm text-gray-300 animate-[fadeIn_0.1s_ease-out]"
      onClick={onClick}
    >
      <button 
        onClick={() => bringToFront(id)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-800 hover:text-white transition-colors text-left"
      >
        <ArrowUpToLine className="h-4 w-4 text-gray-400" /> Bring to Front
      </button>
      <button 
        onClick={() => sendToBack(id)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-800 hover:text-white transition-colors text-left"
      >
        <ArrowDownToLine className="h-4 w-4 text-gray-400" /> Send to Back
      </button>
      
      <div className="h-px bg-gray-800 my-1 mx-2" />
      
      <button 
        onClick={() => duplicateNode(id)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-gray-800 hover:text-white transition-colors text-left"
      >
        <Copy className="h-4 w-4 text-gray-400" /> Duplicate
        <span className="ml-auto text-[10px] text-gray-500 tracking-widest font-mono">⌘D</span>
      </button>
      
      <button 
        onClick={() => deleteNode(id)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2 hover:bg-red-500/20 hover:text-red-400 transition-colors text-left text-red-400"
      >
        <Trash2 className="h-4 w-4" /> Delete
        <span className="ml-auto text-[10px] text-red-500/50 tracking-widest font-mono">⌫</span>
      </button>
    </div>
  );
}

export default ContextMenu;
