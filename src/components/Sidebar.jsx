/**
 * Sidebar (Left Palette) — Redesigned with search-first tool discovery.
 *
 * Features:
 *   - Search bar with ⌘K shortcut
 *   - Recently Used section (auto-populated)
 *   - Favorites / Pinned section
 *   - Categorized browsing with new groups
 *   - Click-to-add + drag-to-add
 *   - Compact & scalable
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ChevronDown, ChevronRight, Search, LogOut,
  Star, Clock, X, ArrowLeft, Plus,
} from 'lucide-react';
import { NODE_CATEGORIES } from '../constants/nodeTypes';
import NODE_TYPES from '../constants/nodeTypes';
import useAuthStore from '../store/useAuthStore';
import useCanvasStore from '../store/useCanvasStore';
import useToolUsageStore from '../store/useToolUsageStore';
import { useReactFlow } from '@xyflow/react';

function handleDragStart(event, nodeType, label) {
  event.dataTransfer.setData(
    'application/systemcanvas-node',
    JSON.stringify({ type: nodeType, label }),
  );
  event.dataTransfer.effectAllowed = 'move';
}

function ToolItem({ type, label, icon: Icon, onClickAdd, isFavorite, onToggleFavorite, isReadOnly }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-roledescription="draggable component"
      draggable={!isReadOnly}
      onDragStart={(e) => !isReadOnly && handleDragStart(e, type, label)}
      onClick={() => !isReadOnly && onClickAdd(type, label)}
      className={`
        group flex items-center gap-3 px-3 py-2
        rounded-lg border border-transparent
        hover:bg-gray-800/60 hover:border-gray-700/50
        ${isReadOnly ? 'cursor-default opacity-60' : 'cursor-grab active:cursor-grabbing'}
        transition-all duration-150 select-none relative
      `}
    >
      <Icon
        className="h-4 w-4 shrink-0 text-gray-500 group-hover:text-blue-400 transition-colors"
        aria-hidden="true"
      />
      <span className="text-sm text-gray-300 group-hover:text-gray-100 transition-colors truncate flex-1">
        {label}
      </span>

      {/* Click-to-add indicator */}
      {!isReadOnly && (
        <Plus className="h-3 w-3 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Favorite toggle */}
      {!isReadOnly && (
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(type); }}
          className={`p-0.5 rounded transition-all ${
            isFavorite
              ? 'text-amber-400 opacity-100'
              : 'text-gray-600 opacity-0 group-hover:opacity-100 hover:text-amber-400'
          }`}
          title={isFavorite ? 'Unpin' : 'Pin to favorites'}
        >
          <Star className={`h-3 w-3 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      )}
    </div>
  );
}

function CategorySection({ title, items, searchQuery, onClickAdd, favorites, onToggleFavorite, isReadOnly }) {
  const [isOpen, setIsOpen] = useState(!searchQuery);

  const filtered = searchQuery
    ? items.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q) ||
          item.keywords?.some((k) => k.toLowerCase().includes(q))
        );
      })
    : items;

  if (filtered.length === 0) return null;

  // Auto-open when searching
  const effectiveOpen = searchQuery ? true : isOpen;

  return (
    <div className="mb-1">
      <button
        onClick={() => !searchQuery && setIsOpen(!isOpen)}
        className="
          flex items-center gap-1.5 w-full
          px-4 pt-3 pb-1.5
          text-[10px] font-semibold uppercase tracking-widest text-gray-500
          hover:text-gray-400 transition-colors
        "
      >
        {effectiveOpen ? (
          <ChevronDown className="h-3 w-3" />
        ) : (
          <ChevronRight className="h-3 w-3" />
        )}
        {title}
        <span className="ml-auto text-gray-600 normal-case tracking-normal">
          {filtered.length}
        </span>
      </button>

      {effectiveOpen && (
        <nav aria-label={`${title} components`} className="flex flex-col gap-0.5 px-3 pb-1">
          {filtered.map((item) => (
            <ToolItem
              key={item.type}
              {...item}
              onClickAdd={onClickAdd}
              isFavorite={favorites.includes(item.type)}
              onToggleFavorite={onToggleFavorite}
              isReadOnly={isReadOnly}
            />
          ))}
        </nav>
      )}
    </div>
  );
}

function Sidebar({ projectId, isReadOnly = false }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const addNode = useCanvasStore((s) => s.addNode);
  const { recentTools, addRecentTool, favorites, toggleFavorite } = useToolUsageStore();

  // Get the viewport for click-to-add positioning
  let getViewportCenter = () => ({ x: 400, y: 300 });
  try {
    const { getViewport, screenToFlowPosition } = useReactFlow();
    getViewportCenter = () => {
      try {
        return screenToFlowPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
      } catch {
        return { x: 400, y: 300 };
      }
    };
  } catch {
    // ReactFlow not yet available
  }

  // Click-to-add handler
  const handleClickAdd = useCallback((type, label) => {
    const center = getViewportCenter();
    // Offset slightly randomly so repeated clicks don't stack perfectly
    const offset = { x: (Math.random() - 0.5) * 100, y: (Math.random() - 0.5) * 100 };
    addNode(type, label, { x: center.x + offset.x, y: center.y + offset.y });
    addRecentTool(type);
  }, [addNode, addRecentTool]);

  // ⌘K shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Build recently used items from NODE_TYPES
  const recentItems = recentTools
    .map((type) => NODE_TYPES.find((t) => t.type === type))
    .filter(Boolean);

  // Build favorites items
  const favoriteItems = favorites
    .map((type) => NODE_TYPES.find((t) => t.type === type))
    .filter(Boolean);

  return (
    <aside
      aria-label="Component palette"
      className="
        flex flex-col w-64 min-w-56
        border-r border-gray-800 bg-gray-900/60
        overflow-y-auto
      "
    >
      {/* App logo + project nav */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 transition-colors"
            title="Back to Dashboard"
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-400" aria-hidden="true" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-gray-100 leading-tight">
              SystemCanvas
            </h1>
            <p className="text-[10px] text-gray-500 leading-tight truncate">
              Component Palette
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 pt-3 pb-1">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="
              w-full pl-8 pr-8 py-1.5
              rounded-lg border border-gray-700/50 bg-gray-800/40
              text-xs text-gray-300 placeholder:text-gray-500
              focus:outline-none focus:ring-1 focus:ring-blue-500/40
              transition-colors
            "
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-300 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          ) : (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 font-mono">⌘K</span>
          )}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Recently Used */}
        {!searchQuery && recentItems.length > 0 && (
          <div className="mb-1">
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              <Clock className="h-3 w-3" />
              Recently Used
            </div>
            <nav className="flex flex-col gap-0.5 px-3 pb-1">
              {recentItems.map((item) => (
                <ToolItem
                  key={`recent-${item.type}`}
                  {...item}
                  onClickAdd={handleClickAdd}
                  isFavorite={favorites.includes(item.type)}
                  onToggleFavorite={toggleFavorite}
                  isReadOnly={isReadOnly}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Favorites */}
        {!searchQuery && favoriteItems.length > 0 && (
          <div className="mb-1">
            <div className="flex items-center gap-1.5 px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-500/70">
              <Star className="h-3 w-3 fill-current" />
              Favorites
            </div>
            <nav className="flex flex-col gap-0.5 px-3 pb-1">
              {favoriteItems.map((item) => (
                <ToolItem
                  key={`fav-${item.type}`}
                  {...item}
                  onClickAdd={handleClickAdd}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  isReadOnly={isReadOnly}
                />
              ))}
            </nav>
          </div>
        )}

        {/* Divider if we have recent/favs */}
        {!searchQuery && (recentItems.length > 0 || favoriteItems.length > 0) && (
          <div className="h-px bg-gray-800 mx-4 my-1" />
        )}

        {/* Category sections */}
        {NODE_CATEGORIES.map((cat) => (
          <CategorySection
            key={cat.title}
            title={cat.title}
            items={cat.items}
            searchQuery={searchQuery}
            onClickAdd={handleClickAdd}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            isReadOnly={isReadOnly}
          />
        ))}

        {/* No search results */}
        {searchQuery && NODE_CATEGORIES.every((cat) =>
          cat.items.every((item) => {
            const q = searchQuery.toLowerCase();
            return !(item.label.toLowerCase().includes(q) || item.type.toLowerCase().includes(q) || item.keywords?.some((k) => k.toLowerCase().includes(q)));
          })
        ) && (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <Search className="h-6 w-6 text-gray-600 mb-2" />
            <p className="text-xs text-gray-500">No components match "{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* User Session */}
      <div className="mt-auto border-t border-gray-800 p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-2 hover:bg-gray-800/60 transition-colors">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-xs border border-indigo-500/30">
            {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-gray-200 truncate leading-tight">{user?.name || 'User'}</span>
            <span className="text-[10px] text-gray-500 truncate leading-tight">{user?.email || user?.role || 'Guest'}</span>
          </div>
          <button
            onClick={async () => { await logout(); navigate('/login'); }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
