/**
 * ShapeNode — Generic shape node (rectangle, circle, diamond).
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

  const shapeClasses = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full aspect-square',
    diamond: 'rotate-45',
  };

  const borderColor = selected
    ? 'border-blue-500/70 ring-2 ring-blue-500/30'
    : 'border-gray-600 hover:border-gray-500';

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          flex items-center justify-center
          min-w-[80px] min-h-[60px]
          border-2 bg-gray-800/80 backdrop-blur-sm
          shadow-lg transition-all duration-150
          ${shapeClasses[shape] || shapeClasses.rectangle}
          ${borderColor}
        `}
        style={{
          width: data.width || (shape === 'circle' ? 80 : 120),
          height: data.height || (shape === 'circle' ? 80 : 60),
          borderColor: data.borderColor || undefined,
          backgroundColor: data.bgColor || undefined,
        }}
      >
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
      </motion.div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </>
  );
}

export default ShapeNode;
