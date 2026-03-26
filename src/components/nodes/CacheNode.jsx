import { MemoryStick } from 'lucide-react';
import BaseNode from './BaseNode';

function CacheNode(props) {
  return (
    <BaseNode
      {...props}
      icon={MemoryStick}
      accentColor="bg-teal-400"
      bgColor="bg-teal-500/15"
    />
  );
}

export default CacheNode;
