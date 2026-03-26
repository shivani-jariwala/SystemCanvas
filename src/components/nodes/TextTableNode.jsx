/**
 * TextTableNode — Rich text block or simple table on the canvas.
 *
 * Supports two modes:
 *   • "text" — a styled text block with title and body
 *   • "table" — a simple 2-column key-value table
 */
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import useCanvasStore from '../../store/useCanvasStore';

const handleStyle = "!w-2 !h-2 !bg-gray-500 !border-2 !border-gray-800 hover:!bg-blue-400 !transition-colors";

function TextTableNode({ id, data, selected }) {
  const updateNodeData = useCanvasStore((s) => s.updateNodeData);
  const mode = data.mode || 'text';

  const borderColor = selected
    ? 'border-blue-500/70 ring-2 ring-blue-500/30'
    : 'border-gray-700/60 hover:border-gray-600';

  const handleTitleChange = useCallback(
    (e) => updateNodeData(id, { label: e.target.value }),
    [id, updateNodeData],
  );

  const handleBodyChange = useCallback(
    (e) => updateNodeData(id, { body: e.target.value }),
    [id, updateNodeData],
  );

  const handleAddRow = useCallback(() => {
    const rows = data.rows || [];
    updateNodeData(id, { rows: [...rows, { key: 'Key', value: 'Value' }] });
  }, [id, data.rows, updateNodeData]);

  const handleUpdateRow = useCallback(
    (index, field, value) => {
      const rows = [...(data.rows || [])];
      rows[index] = { ...rows[index], [field]: value };
      updateNodeData(id, { rows });
    },
    [id, data.rows, updateNodeData],
  );

  const handleRemoveRow = useCallback(
    (index) => {
      const rows = [...(data.rows || [])];
      rows.splice(index, 1);
      updateNodeData(id, { rows });
    },
    [id, data.rows, updateNodeData],
  );

  return (
    <>
      <Handle type="target" position={Position.Top} className={handleStyle} />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={`
          min-w-[200px] rounded-xl border
          bg-gray-900/90 backdrop-blur-sm shadow-lg
          transition-all duration-150
          ${borderColor}
        `}
      >
        {/* Title */}
        <div className="border-b border-gray-700/60 px-3 py-2">
          <input
            type="text"
            value={data.label || ''}
            onChange={handleTitleChange}
            className="
              w-full bg-transparent border-none outline-none
              text-sm font-semibold text-gray-100
              placeholder:text-gray-500
            "
            placeholder={mode === 'table' ? 'Table Title' : 'Text Title'}
          />
        </div>

        {mode === 'text' ? (
          <textarea
            value={data.body || ''}
            onChange={handleBodyChange}
            placeholder="Type your text here..."
            className="
              w-full min-h-[80px] resize-y
              bg-transparent border-none outline-none
              px-3 py-2 text-sm text-gray-300 leading-relaxed
              placeholder:text-gray-500
            "
          />
        ) : (
          <div className="p-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left px-2 py-1 text-[10px] uppercase tracking-wider font-medium">Key</th>
                  <th className="text-left px-2 py-1 text-[10px] uppercase tracking-wider font-medium">Value</th>
                  <th className="w-6" />
                </tr>
              </thead>
              <tbody>
                {(data.rows || []).map((row, i) => (
                  <tr key={i} className="border-t border-gray-800/60">
                    <td className="px-1 py-0.5">
                      <input
                        type="text"
                        value={row.key}
                        onChange={(e) => handleUpdateRow(i, 'key', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-gray-300 text-xs px-1"
                      />
                    </td>
                    <td className="px-1 py-0.5">
                      <input
                        type="text"
                        value={row.value}
                        onChange={(e) => handleUpdateRow(i, 'value', e.target.value)}
                        className="w-full bg-transparent border-none outline-none text-gray-400 text-xs px-1"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleRemoveRow(i)}
                        className="text-gray-600 hover:text-red-400 text-xs transition-colors"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleAddRow}
              className="
                w-full mt-1 py-1 text-[10px] text-gray-500
                hover:text-gray-300 hover:bg-gray-800/40
                rounded transition-colors
              "
            >
              + Add Row
            </button>
          </div>
        )}
      </motion.div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
    </>
  );
}

export default TextTableNode;
