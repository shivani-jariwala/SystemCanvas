import { Globe } from 'lucide-react';
import BaseNode from './BaseNode';

function ApiGatewayNode(props) {
  return (
    <BaseNode
      {...props}
      icon={Globe}
      accentColor="bg-violet-400"
      bgColor="bg-violet-500/15"
    />
  );
}

export default ApiGatewayNode;
