import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { User, Router, Globe, Bot, Database, Sparkles } from 'lucide-react';

const iconMap = {
  user: User,
  dns: Router,
  cdn: Globe,
  aiModel: Bot,
  vectorDb: Database,
  llm: Sparkles
};

export const createSystemNode = (typeKey) => {
  return memo(function GenericSystemNode({ data, selected }) {
    const Icon = iconMap[typeKey] || Globe;
    
    return (
      <div className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all
        bg-gray-900 border-gray-700
        ${selected ? 'ring-2 ring-blue-500 border-blue-500 shadow-xl' : 'shadow-lg hover:border-gray-600'}
      `}>
        <Handle type="target" position={Position.Left} className="w-2 h-2 bg-blue-500 border-2 border-gray-900" />
        
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-blue-400 border border-gray-700 shadow-inner">
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col min-w-[100px] pr-4">
          <span className="text-sm font-semibold text-gray-100">{data.label}</span>
          {data.status && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-1.5 h-1.5 rounded-full ${data.status === 'healthy' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{data.status}</span>
            </div>
          )}
        </div>
        
        <Handle type="source" position={Position.Right} className="w-2 h-2 bg-blue-500 border-2 border-gray-900" />
      </div>
    );
  });
};
