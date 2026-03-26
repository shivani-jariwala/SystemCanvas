import { Network } from 'lucide-react';
import BaseNode from './BaseNode';

function LoadBalancerNode(props) {
  return (
    <BaseNode
      {...props}
      icon={Network}
      accentColor="bg-sky-400"
      bgColor="bg-sky-500/15"
    />
  );
}

export default LoadBalancerNode;
