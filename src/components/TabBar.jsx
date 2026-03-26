import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import useCanvasStore from '../store/useCanvasStore';

function TabBar() {
  const pages = useCanvasStore((s) => s.pages);
  const activePageId = useCanvasStore((s) => s.activePageId);
  const switchPage = useCanvasStore((s) => s.switchPage);
  const createPage = useCanvasStore((s) => s.createPage);
  const deletePage = useCanvasStore((s) => s.deletePage);
  const renamePage = useCanvasStore((s) => s.renamePage);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleDoubleClick = (page) => {
    setEditingId(page.id);
    setEditName(page.name);
  };

  const handleRenameSubmit = () => {
    if (editName.trim()) {
      renamePage(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleRenameSubmit();
    if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center bg-gray-950/80 backdrop-blur-md border-t border-gray-800 px-2 h-10 overflow-x-auto select-none">
      <div className="flex items-center gap-1 flex-1">
        {pages.map((p) => {
          const isActive = p.id === activePageId;
          return (
            <div
              key={p.id}
              onClick={() => switchPage(p.id)}
              onDoubleClick={() => handleDoubleClick(p)}
              className={`
                group flex items-center gap-2 px-3 py-1.5 text-sm rounded-t-md cursor-pointer border-b-2
                transition-colors min-w-[100px] max-w-[200px]
                ${isActive 
                  ? 'bg-gray-800 text-blue-400 border-blue-500' 
                  : 'text-gray-400 border-transparent hover:bg-gray-900 hover:text-gray-200'}
              `}
            >
              {editingId === p.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={handleRenameSubmit}
                  onKeyDown={handleKeyDown}
                  className="bg-gray-950 text-gray-100 px-1 py-0 w-full outline-none text-xs rounded border border-blue-500"
                />
              ) : (
                <span className="truncate flex-1 text-xs font-medium" title={p.name}>{p.name}</span>
              )}

              {pages.length > 1 && !editingId && (
                <button
                  onClick={(e) => { e.stopPropagation(); deletePage(p.id); }}
                  className={`
                    p-0.5 rounded-md hover:bg-gray-700 hover:text-red-400 transition-colors
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                  `}
                  title="Close tab"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={() => createPage()}
          title="New Page"
          className="ml-1 p-1.5 text-gray-500 hover:text-gray-200 hover:bg-gray-800 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default TabBar;
