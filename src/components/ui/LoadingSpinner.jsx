/**
 * LoadingSpinner — Consistent loading state component.
 */
function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizes[size]} animate-spin rounded-full border-2 border-gray-700 border-t-indigo-500`} />
      {label && <p className={`${textSizes[size]} text-gray-500 animate-pulse`}>{label}</p>}
    </div>
  );
}

export default LoadingSpinner;
