import { memo } from 'react';
import { NodeResizer } from '@xyflow/react';

function GroupNode({ data, selected }) {
  return (
    <>
      <NodeResizer 
        color="#6366f1" 
        isVisible={selected} 
        minWidth={200}
        minHeight={200}
      />
      <div 
        className="
          w-full h-full min-w-[200px] min-h-[200px] 
          bg-indigo-500/5 border-2 border-dashed border-indigo-500/30 
          rounded-xl flex flex-col overflow-hidden relative
        "
      >
        <div className="h-8 bg-indigo-900/30 border-b border-indigo-500/20 flex items-center px-4 cursor-grab active:cursor-grabbing text-xs font-bold text-indigo-300 uppercase tracking-widest truncate">
          {data.label || 'VPC / Group'}
        </div>
      </div>
    </>
  );
}

export default memo(GroupNode);
