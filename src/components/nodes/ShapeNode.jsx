/**
 * ShapeNode — Generic shape node (rectangle, circle, diamond, arrow).
 *
 * Renders a shape on the canvas with handles on all 4 sides.
 * Used for flowchart-style diagramming.
 */
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import useCanvasStore from '../../store/useCanvasStore';

const handleStyle = "!w-2 !h-2 !bg-gray-500 !border-2 !border-gray-800 hover:!bg-blue-400 !transition-colors";

function ShapeNode({ id, data, selected }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const shape = data.shape || 'rectangle';
  const isArrow = shape === 'arrow';

  const shapeClasses = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
    arrow: '',
  };

  const borderColor = selected
    ? 'border-blue-500/70 ring-2 ring-blue-500/30'
    : 'border-gray-600 hover:border-gray-500';

  const arrowW = data.width || 128;
  const arrowH = data.height || 40;

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          flex items-center justify-center relative
          ${isArrow
            ? 'border-2 border-transparent bg-transparent shadow-none'
            : `min-w-[80px] min-h-[60px] border-2 bg-gray-800/80 backdrop-blur-sm shadow-lg ${shapeClasses[shape] || shapeClasses.rectangle}`}
          ${!isArrow ? borderColor : selected ? 'ring-2 ring-blue-500/40 rounded-md' : ''}
        `}
        style={
          isArrow
            ? { width: arrowW, height: arrowH }
            : {
                width: data.width || (shape === 'circle' ? 80 : 120),
                height: data.height || (shape === 'circle' ? 80 : 60),
                borderColor: data.borderColor || undefined,
                backgroundColor: data.bgColor || undefined,
              }
        }
      >
        {isArrow ? (
          <>
            <svg
              className={`absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] ${selected ? 'text-blue-400' : 'text-slate-400'}`}
              viewBox="0 0 120 32"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <title>Arrow</title>
              <path
                fill="currentColor"
                d="M2 12 L 74 12 L 74 4 L 118 16 L 74 28 L 74 20 L 2 20 Z"
              />
            </svg>
            <input
              type="text"
              value={data.label || ''}
              onChange={(e) => updateNodeData(id, { label: e.target.value })}
              className="
                relative z-10 bg-black/35 border border-gray-600/50 rounded px-1.5 py-0.5
                text-center text-[11px] text-gray-100 max-w-[55%] outline-none
                focus:border-blue-500/60 placeholder:text-gray-500
              "
              placeholder=""
              onClick={(e) => e.stopPropagation()}
            />
          </>
        ) : (
          <div className={shape === 'diamond' ? '-rotate-45' : ''}>
            <input
              type="text"
              value={data.label || ''}
              onChange={(e) => updateNodeData(id, { label: e.target.value })}
              className="
                bg-transparent border-none outline-none
                text-center text-sm text-gray-200
                w-full px-2
                placeholder:text-gray-500
              "
              placeholder="Label"
            />
          </div>
        )}
      </motion.div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </>
  );
}

export default ShapeNode;
