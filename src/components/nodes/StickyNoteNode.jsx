/**
 * StickyNoteNode — Editable sticky note on the canvas.
 *
 * A simple text area with a colored background.
 * Unlike system component nodes, it has no handles by default
 * and is meant for annotations / notes.
 */
import { useState, useCallback } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import { motion } from 'framer-motion';
import useCanvasStore from '../../store/useCanvasStore';

const COLORS = [
  { name: 'yellow', bg: 'bg-yellow-300', text: 'text-yellow-900', border: 'border-yellow-400' },
  { name: 'blue',   bg: 'bg-blue-300',   text: 'text-blue-900',   border: 'border-blue-400' },
  { name: 'green',  bg: 'bg-emerald-300', text: 'text-emerald-900', border: 'border-emerald-400' },
  { name: 'pink',   bg: 'bg-pink-300',    text: 'text-pink-900',    border: 'border-pink-400' },
  { name: 'purple', bg: 'bg-purple-300',  text: 'text-purple-900',  border: 'border-purple-400' },
];

function StickyNoteNode({ id, data, selected }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const colorIndex = COLORS.findIndex((c) => c.name === (data.color || 'yellow'));
  const color = COLORS[colorIndex >= 0 ? colorIndex : 0];

  const handleTextChange = useCallback(
    (e) => updateNodeData(id, { label: e.target.value }),
    [id, updateNodeData],
  );

  const cycleColor = useCallback(() => {
    const next = COLORS[((colorIndex >= 0 ? colorIndex : 0) + 1) % COLORS.length];
    updateNodeData(id, { color: next.name });
  }, [id, colorIndex, updateNodeData]);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-gray-600 !border-gray-800 !opacity-0 hover:!opacity-100 !transition-opacity"
      />

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          relative min-w-[150px] min-h-[100px]
          rounded-lg shadow-lg
          ${color.bg} ${color.border}
          border-2
          ${selected ? 'ring-2 ring-blue-500/50' : ''}
        `}
        style={{ width: data.width || 200, height: data.height || 150 }}
      >
        {/* Color switcher */}
        <button
          onClick={cycleColor}
          className={`
            absolute top-1.5 right-1.5 z-10
            h-4 w-4 rounded-full
            border border-black/20
            opacity-0 hover:opacity-100 transition-opacity
            ${COLORS[((colorIndex >= 0 ? colorIndex : 0) + 1) % COLORS.length].bg}
          `}
          title="Change color"
        />

        {/* Fold effect */}
        <div
          className="absolute top-0 right-0 w-5 h-5 overflow-hidden"
          style={{ filter: 'brightness(0.85)' }}
        >
          <div
            className={`absolute -top-2.5 -right-2.5 w-5 h-5 rotate-45 ${color.bg}`}
            style={{ boxShadow: '-1px 1px 2px rgba(0,0,0,0.15)' }}
          />
        </div>

        <textarea
          value={data.label || ''}
          onChange={handleTextChange}
          placeholder="Type a note..."
          className={`
            w-full h-full resize-none
            bg-transparent border-none outline-none
            p-3 text-sm font-medium leading-relaxed
            ${color.text}
            placeholder:opacity-50
          `}
          style={{ minHeight: '80px' }}
        />
      </motion.div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-gray-600 !border-gray-800 !opacity-0 hover:!opacity-100 !transition-opacity"
      />
    </>
  );
}

export default StickyNoteNode;
