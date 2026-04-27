/**
 * KeyboardShortcutsModal — Shows all available keyboard shortcuts.
 */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { category: 'Canvas', items: [
    { keys: ['⌘', 'Z'], label: 'Undo' },
    { keys: ['⌘', '⇧', 'Z'], label: 'Redo' },
    { keys: ['⌘', 'A'], label: 'Select all' },
    { keys: ['⌘', 'D'], label: 'Duplicate selected' },
    { keys: ['Delete'], label: 'Delete selected' },
    { keys: ['⌘', '+'], label: 'Zoom in' },
    { keys: ['⌘', '-'], label: 'Zoom out' },
    { keys: ['⌘', '0'], label: 'Reset zoom' },
    { keys: ['⌘', '1'], label: 'Zoom to fit' },
  ]},
  { category: 'Navigation', items: [
    { keys: ['⌘', 'K'], label: 'Search tools' },
    { keys: ['?'], label: 'Keyboard shortcuts' },
    { keys: ['Esc'], label: 'Deselect / Close' },
  ]},
  { category: 'File', items: [
    { keys: ['⌘', 'S'], label: 'Save project' },
    { keys: ['⌘', 'E'], label: 'Export as PNG' },
  ]},
];

function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15">
                <Keyboard className="h-4 w-4 text-indigo-400" />
              </div>
              <h2 className="text-base font-semibold text-gray-100">Keyboard Shortcuts</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
            {SHORTCUTS.map((section) => (
              <div key={section.category}>
                <h3 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((shortcut) => (
                    <div key={shortcut.label} className="flex items-center justify-between py-1.5">
                      <span className="text-sm text-gray-300">{shortcut.label}</span>
                      <div className="flex items-center gap-1">
                        {shortcut.keys.map((key, i) => (
                          <kbd key={i} className="min-w-[28px] px-2 py-1 text-[11px] font-mono font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-md text-center shadow-sm">
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default KeyboardShortcutsModal;
