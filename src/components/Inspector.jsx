/**
 * Inspector (Right Sidebar)
 *
 * Reads the selected node from the Zustand store and renders
 * editable property fields with Framer Motion transitions.
 * Every keystroke calls updateNodeData — React Flow re-renders
 * the custom node on the canvas instantly.
 */
import { SlidersHorizontal, Tag, Activity, Signal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import useCanvasStore from '../store/useCanvasStore';
import NODE_TYPES from '../constants/nodeTypes';

/** Reusable label + input wrapper. */
function Field({ label, htmlFor, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-[11px] font-medium uppercase tracking-wider text-gray-500"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClasses = `
  w-full rounded-lg border border-gray-700 bg-gray-800/70
  px-3 py-2 text-sm text-gray-100
  placeholder:text-gray-500
  focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60
  transition-colors
`;

/** Shared animation variants for panel content. */
const panelVariants = {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

function Inspector() {
  const selectedNodeId = useCanvasStore((s) => s.selectedNodeId);
  const nodes = useCanvasStore((s) => s.nodes);
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);

  const selectedNode = selectedNodeId
    ? nodes.find((n) => n.id === selectedNodeId) ?? null
    : null;

  const typeMeta = selectedNode
    ? NODE_TYPES.find((t) => t.type === selectedNode.type)
    : null;

  const TypeIcon = typeMeta?.icon ?? SlidersHorizontal;

  return (
    <aside
      aria-label="Node inspector"
      className="
        flex flex-col w-72 min-w-60
        border-l border-gray-800 bg-gray-900/60
        overflow-y-auto overflow-x-hidden
      "
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-800">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Inspector
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {selectedNode ? (
          <motion.div
            key={selectedNode.id}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col gap-5 p-4"
          >
            {/* Node type badge */}
            <div className="flex items-center gap-2.5 rounded-lg bg-gray-800/60 px-3 py-2">
              <TypeIcon className="h-4 w-4 text-blue-400 shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-300 truncate">
                  {typeMeta?.label ?? selectedNode.type}
                </p>
                <p className="text-[10px] text-gray-500">{selectedNode.id}</p>
              </div>
            </div>

            {/* Label */}
            <Field label="Name" htmlFor="inspector-label">
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                <input
                  id="inspector-label"
                  type="text"
                  value={selectedNode.data.label}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, { label: e.target.value })
                  }
                  className={`${inputClasses} pl-9`}
                  placeholder="Node name"
                />
              </div>
            </Field>

            {/* Latency */}
            <Field label="Simulated Latency (ms)" htmlFor="inspector-latency">
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                <input
                  id="inspector-latency"
                  type="number"
                  min={0}
                  max={9999}
                  value={selectedNode.data.latency}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      latency: Math.max(0, Number(e.target.value) || 0),
                    })
                  }
                  className={`${inputClasses} pl-9`}
                  placeholder="0"
                />
              </div>
            </Field>

            {/* Status */}
            <Field label="Status" htmlFor="inspector-status">
              <div className="relative">
                <Signal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" aria-hidden="true" />
                <select
                  id="inspector-status"
                  value={selectedNode.data.status}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, { status: e.target.value })
                  }
                  className={`${inputClasses} pl-9 appearance-none cursor-pointer`}
                >
                  <option value="healthy">Healthy</option>
                  <option value="degraded">Degraded</option>
                  <option value="down">Down</option>
                </select>
              </div>
            </Field>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center flex-1 px-6 py-12 text-center"
          >
            <SlidersHorizontal
              className="h-8 w-8 text-gray-600"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-gray-400">
              Select a node on the canvas to inspect and edit its properties.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

export default Inspector;
