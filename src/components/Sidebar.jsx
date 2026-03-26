/**
 * Sidebar (Left Palette)
 *
 * Displays the app logo and a library of draggable system component
 * types, organized by category.  Uses the native HTML5 Drag API to
 * transfer the node's type and label to the Canvas drop handler.
 */
import { useState } from 'react';
import { LayoutDashboard, ChevronDown, ChevronRight, Search, LogOut } from 'lucide-react';
import { NODE_CATEGORIES } from '../constants/nodeTypes';
import useAuthStore from '../store/useAuthStore';

function handleDragStart(event, nodeType, label) {
  event.dataTransfer.setData(
    'application/systemcanvas-node',
    JSON.stringify({ type: nodeType, label }),
  );
  event.dataTransfer.effectAllowed = 'move';
}

function CategorySection({ title, items, searchQuery }) {
  const [isOpen, setIsOpen] = useState(true);

  const filtered = searchQuery
    ? items.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : items;

  if (filtered.length === 0) return null;

  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 w-full
          px-4 pt-3 pb-1.5
          text-[10px] font-semibold uppercase tracking-widest text-gray-500
          hover:text-gray-400 transition-colors
        "
      >
        {isOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {title}
        <span className="ml-auto text-gray-600 normal-case tracking-normal">
          {filtered.length}
        </span>
      </button>

      {isOpen && (
        <nav aria-label={`${title} components`} className="flex flex-col gap-0.5 px-3 pb-1">
          {filtered.map(({ type, label, icon: Icon }) => (
            <div
              key={type}
              role="button"
              tabIndex={0}
              aria-roledescription="draggable component"
              draggable
              onDragStart={(e) => handleDragStart(e, type, label)}
              className="
                group flex items-center gap-3 px-3 py-2
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
              <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors truncate">
                {label}
              </span>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}

function Sidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

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

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="
              w-full pl-8 pr-3 py-1.5
              rounded-lg border border-gray-700/50 bg-gray-800/40
              text-xs text-gray-300 placeholder:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500/40
              transition-colors
            "
          />
        </div>
      </div>

      {/* Category sections */}
      <div className="flex-1 overflow-y-auto">
        {NODE_CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.title}
            title={cat.title}
            items={cat.items}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* User Session Pinned to Bottom */}
      <div className="mt-auto border-t border-gray-800 p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-gray-800/60 transition-colors">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-xs border border-indigo-500/30">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-200 truncate leading-tight">{user?.name || 'User'}</span>
            <span className="text-[10px] text-gray-500 truncate leading-tight">{user?.role || 'Guest'}</span>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            title="Log out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
