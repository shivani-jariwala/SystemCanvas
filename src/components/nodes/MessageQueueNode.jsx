import { MessageSquare } from 'lucide-react';
import BaseNode from './BaseNode';

function MessageQueueNode(props) {
  return (
    <BaseNode
      {...props}
      icon={MessageSquare}
      accentColor="bg-amber-400"
      bgColor="bg-amber-500/15"
    />
  );
}

export default MessageQueueNode;
