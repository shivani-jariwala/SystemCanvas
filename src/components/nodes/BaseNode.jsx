/**
 * BaseNode — shared visual shell for every custom node on the canvas.
 *
 * Renders a rounded card with:
 *   • a coloured accent stripe on the left edge
 *   • an icon + label header
 *   • a status indicator dot
 *   • React Flow Handles for incoming (top) and outgoing (bottom) edges
 *   • Framer Motion scale-in animation on mount
 */
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

const statusColors = {
  healthy: 'bg-emerald-400',
  degraded: 'bg-amber-400',
  down: 'bg-red-400',
};

const statusGlow = {
  healthy: 'shadow-emerald-500/20',
  degraded: 'shadow-amber-500/20',
  down: 'shadow-red-500/20',
};

function BaseNode({ data, selected, icon: Icon, accentColor, bgColor }) {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-gray-800 hover:!bg-blue-400 !transition-colors"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          relative flex items-center gap-3
          min-w-[160px] px-3 py-2.5
          rounded-xl border
          bg-gray-900/90 backdrop-blur-sm
          shadow-lg ${statusGlow[data.status] ?? ''}
          transition-all duration-150
          ${selected
            ? 'border-blue-500/70 ring-2 ring-blue-500/30'
            : 'border-gray-700/60 hover:border-gray-600'}
        `}
      >
        {/* Coloured left accent stripe */}
        <div
          className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${accentColor}`}
        />

        {/* Icon badge */}
        <div
          className={`
            flex items-center justify-center
            h-8 w-8 rounded-lg shrink-0
            ${bgColor}
          `}
        >
          <Icon className={`h-4 w-4 ${accentColor.replace('bg-', 'text-')}`} aria-hidden="true" />
        </div>

        {/* Label + status row */}
        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-medium text-gray-100 truncate leading-tight">
            {data.label}
          </span>
          <span className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${statusColors[data.status] ?? statusColors.healthy}`}
            />
            <span className="text-[10px] text-gray-400 capitalize">
              {data.status}
            </span>
            {data.latency > 0 && (
              <span className="text-[10px] text-gray-500 ml-1">
                {data.latency}ms
              </span>
            )}
          </span>
        </div>
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-gray-500 !border-2 !border-gray-800 hover:!bg-blue-400 !transition-colors"
      />
    </>
  );
}

export default BaseNode;
