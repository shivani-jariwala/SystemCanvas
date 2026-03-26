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
import StickyNoteNode from './StickyNoteNode';
import ShapeNode from './ShapeNode';
import TextTableNode from './TextTableNode';
import { createCloudNode } from './CloudProviderNode';

const nodeTypes = {
  // Core system components
  apiGateway: ApiGatewayNode,
  loadBalancer: LoadBalancerNode,
  microservice: MicroserviceNode,
  messageQueue: MessageQueueNode,
  database: DatabaseNode,
  cache: CacheNode,

  // Annotations
  stickyNote: StickyNoteNode,
  textBlock: TextTableNode,
  tableBlock: TextTableNode,

  // Shapes
  shapeRect: ShapeNode,
  shapeCircle: ShapeNode,
  shapeDiamond: ShapeNode,

  // AWS
  awsEC2: createCloudNode('awsEC2'),
  awsS3: createCloudNode('awsS3'),
  awsLambda: createCloudNode('awsLambda'),
  awsRDS: createCloudNode('awsRDS'),
  awsSQS: createCloudNode('awsSQS'),
  awsSNS: createCloudNode('awsSNS'),

  // GCP
  gcpCompute: createCloudNode('gcpCompute'),
  gcpStorage: createCloudNode('gcpStorage'),
  gcpFunctions: createCloudNode('gcpFunctions'),
  gcpBigQuery: createCloudNode('gcpBigQuery'),
  gcpPubSub: createCloudNode('gcpPubSub'),

  // Azure
  azureVM: createCloudNode('azureVM'),
  azureBlob: createCloudNode('azureBlob'),
  azureFunctions: createCloudNode('azureFunctions'),
  azureSQL: createCloudNode('azureSQL'),
  azureServiceBus: createCloudNode('azureServiceBus'),

  // Kubernetes
  k8sPod: createCloudNode('k8sPod'),
  k8sService: createCloudNode('k8sService'),
  k8sDeployment: createCloudNode('k8sDeployment'),
  k8sIngress: createCloudNode('k8sIngress'),
  k8sConfigMap: createCloudNode('k8sConfigMap'),
};

export default nodeTypes;
