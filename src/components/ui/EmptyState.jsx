/**
 * EmptyState — Reusable empty state with icon, title, description, and CTA.
 */
function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {Icon && (
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-800/60 border border-gray-700/50 mb-5">
          <Icon className="h-7 w-7 text-gray-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
      {description && <p className="mt-2 text-sm text-gray-500 max-w-sm leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
