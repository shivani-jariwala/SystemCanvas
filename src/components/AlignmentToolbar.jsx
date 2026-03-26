import { AlignLeft, AlignCenter, AlignRight, AlignVerticalSpaceAround, AlignHorizontalSpaceAround } from 'lucide-react';
import useCanvasStore from '../store/useCanvasStore';

function AlignmentToolbar() {
  const nodes = useCanvasStore((s) => s.nodes);
  const alignSelected = useCanvasStore((s) => s.alignSelected);
  
  const selectedCount = nodes.filter(n => n.selected).length;
  if (selectedCount < 2) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 px-2 py-1.5 rounded-xl bg-gray-900/90 border border-gray-700/60 backdrop-blur-md shadow-2xl animate-[slideIn_0.2s_ease-out]">
      <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mr-2 select-none">
        Align {selectedCount} objects
      </div>
      
      <button onClick={() => alignSelected('left')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Left">
        <AlignLeft className="h-4 w-4" />
      </button>
      <button onClick={() => alignSelected('center')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Center">
        <AlignCenter className="h-4 w-4" />
      </button>
      <button onClick={() => alignSelected('right')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Right">
        <AlignRight className="h-4 w-4" />
      </button>

      <div className="w-px h-4 bg-gray-700/60 mx-1" />

      <button onClick={() => alignSelected('top')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Top">
        <AlignVerticalSpaceAround className="h-4 w-4" />
      </button>
      <button onClick={() => alignSelected('middle')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Middle">
        <AlignHorizontalSpaceAround className="h-4 w-4" />
      </button>
      <button onClick={() => alignSelected('bottom')} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors" title="Align Bottom">
        <AlignVerticalSpaceAround className="h-4 w-4 rotate-180" />
      </button>
    </div>
  );
}

export default AlignmentToolbar;
