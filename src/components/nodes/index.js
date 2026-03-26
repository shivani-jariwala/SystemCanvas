/**
 * Custom node type registry.
 *
 * Maps the type strings used in NODE_TYPES and the Zustand store
 * to the React components React Flow renders for each node.
 *
 * IMPORTANT: this object must be defined outside of any component
 * so React Flow doesn't re-mount nodes on every render.
 */
import ApiGatewayNode from './ApiGatewayNode';
import LoadBalancerNode from './LoadBalancerNode';
import MicroserviceNode from './MicroserviceNode';
import MessageQueueNode from './MessageQueueNode';
import DatabaseNode from './DatabaseNode';
import CacheNode from './CacheNode';

const nodeTypes = {
  apiGateway: ApiGatewayNode,
  loadBalancer: LoadBalancerNode,
  microservice: MicroserviceNode,
  messageQueue: MessageQueueNode,
  database: DatabaseNode,
  cache: CacheNode,
};

export default nodeTypes;
