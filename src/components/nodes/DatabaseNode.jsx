import { Database } from 'lucide-react';
import BaseNode from './BaseNode';

function DatabaseNode(props) {
  return (
    <BaseNode
      {...props}
      icon={Database}
      accentColor="bg-rose-400"
      bgColor="bg-rose-500/15"
    />
  );
}

export default DatabaseNode;
