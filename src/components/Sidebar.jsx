/**
 * Sidebar (Left Palette)
 *
 * Displays the app logo and a library of draggable system component
 * types.  Uses the native HTML5 Drag API to transfer the node's type
 * and label to the Canvas drop handler.
 */
import { LayoutDashboard } from 'lucide-react';
import NODE_TYPES from '../constants/nodeTypes';

function handleDragStart(event, nodeType, label) {
  event.dataTransfer.setData(
    'application/systemcanvas-node',
    JSON.stringify({ type: nodeType, label }),
  );
  event.dataTransfer.effectAllowed = 'move';
}

function Sidebar() {
  return (
    <aside
      aria-label="Component palette"
      className="
        flex flex-col w-64 min-w-56
        border-r border-gray-800 bg-gray-900/60
        overflow-y-auto
      "
    >
      {/* App logo */}
      <div className="px-4 py-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-500/15">
            <LayoutDashboard className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-100 leading-tight">
              SystemCanvas
            </h1>
            <p className="text-[10px] text-gray-500 leading-tight">
              Architecture Visualizer
            </p>
          </div>
        </div>
      </div>

      {/* Section header */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Components
        </h2>
      </div>

      {/* Palette items — each is a native draggable */}
      <nav aria-label="Draggable components" className="flex flex-col gap-1.5 px-3 pb-3">
        {NODE_TYPES.map(({ type, label, icon: Icon }) => (
          <div
            key={type}
            role="button"
            tabIndex={0}
            aria-roledescription="draggable component"
            draggable
            onDragStart={(e) => handleDragStart(e, type, label)}
            className="
              group flex items-center gap-3 px-3 py-2.5
              rounded-lg border border-transparent
              hover:bg-gray-800/60 hover:border-gray-700/50
              cursor-grab active:cursor-grabbing
              transition-all duration-150 select-none
            "
          >
            <Icon
              className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-blue-400 transition-colors"
              aria-hidden="true"
            />
            <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
              {label}
            </span>
          </div>
        ))}
      </nav>

      {/* Hint pinned to the bottom */}
      <div className="mt-auto px-4 py-3 border-t border-gray-800">
        <p className="text-[11px] text-gray-500 leading-relaxed">
          Drag a component onto the canvas to add it to your architecture.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
