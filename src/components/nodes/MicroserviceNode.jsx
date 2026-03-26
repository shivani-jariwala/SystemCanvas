import { Boxes } from 'lucide-react';
import BaseNode from './BaseNode';

function MicroserviceNode(props) {
  return (
    <BaseNode
      {...props}
      icon={Boxes}
      accentColor="bg-emerald-400"
      bgColor="bg-emerald-500/15"
    />
  );
}

export default MicroserviceNode;
