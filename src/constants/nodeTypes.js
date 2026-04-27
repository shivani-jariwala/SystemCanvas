/**
 * NODE_TYPES — master list of system component types.
 *
 * Organized into categories for the sidebar.
 * Each entry drives palette rendering, drag-and-drop creation,
 * and custom node resolution.
 *
 * Now includes `keywords` for improved search matching.
 */
import {
  User,
  Router,
  Globe,
  Bot,
  Sparkles,
  Network,
  Boxes,
  MessageSquare,
  Database,
  MemoryStick,
  StickyNote,
  Square,
  Circle,
  Diamond,
  ArrowRight,
  Type,
  Table,
  // AWS
  Server,
  HardDrive,
  Zap,
  Mail,
  // GCP
  Cloud,
  Archive,
  BrainCircuit,
  Radio,
  // Azure
  Monitor,
  Container,
  DatabaseZap,
  Bus,
  // Kubernetes
  Box,
  Webhook,
  Layers,
  Shield,
  FileText,
} from 'lucide-react';

/**
 * Categories for the sidebar. Reorganized per n8n-inspired grouping
 * with keywords for search.
 */
const NODE_CATEGORIES = [
  {
    title: 'Input / Trigger',
    items: [
      { type: 'userNode',      label: 'User / Browser',  icon: User,     keywords: ['client', 'browser', 'frontend', 'user', 'input', 'trigger'] },
      { type: 'dnsNode',       label: 'DNS',             icon: Router,   keywords: ['domain', 'nameserver', 'resolve', 'dns'] },
      { type: 'cdnNode',       label: 'CDN',             icon: Globe,    keywords: ['content', 'delivery', 'edge', 'cloudfront', 'cdn'] },
      { type: 'apiGateway',    label: 'API Gateway',     icon: Network,  keywords: ['gateway', 'api', 'rest', 'graphql', 'route', 'proxy'] },
      { type: 'loadBalancer',  label: 'Load Balancer',   icon: Network,  keywords: ['balancer', 'lb', 'nginx', 'haproxy', 'traffic'] },
    ],
  },
  {
    title: 'Data / Storage',
    items: [
      { type: 'database',      label: 'Database',        icon: Database,       keywords: ['db', 'sql', 'postgres', 'mysql', 'mongo', 'storage'] },
      { type: 'cache',         label: 'Cache',           icon: MemoryStick,    keywords: ['redis', 'memcached', 'cache', 'memory', 'fast'] },
      { type: 'messageQueue',  label: 'Message Queue',   icon: MessageSquare,  keywords: ['queue', 'kafka', 'rabbitmq', 'sqs', 'pub', 'sub'] },
      { type: 'vectorDbNode',  label: 'Vector DB',       icon: Database,       keywords: ['pinecone', 'weaviate', 'vector', 'embedding', 'search'] },
    ],
  },
  {
    title: 'Logic / Control Flow',
    items: [
      { type: 'microservice',  label: 'Microservice',    icon: Boxes,    keywords: ['service', 'backend', 'api', 'logic', 'compute', 'server'] },
    ],
  },
  {
    title: 'AI / LLM',
    items: [
      { type: 'aiModelNode',   label: 'AI Model',        icon: Bot,      keywords: ['ai', 'model', 'ml', 'tensorflow', 'pytorch', 'inference'] },
      { type: 'llmNode',       label: 'LLM Engine',      icon: Sparkles, keywords: ['llm', 'gpt', 'claude', 'language', 'model', 'chat'] },
    ],
  },
  {
    title: 'AWS',
    items: [
      { type: 'awsEC2',    label: 'EC2',       icon: Server,         keywords: ['aws', 'ec2', 'instance', 'compute', 'vm'] },
      { type: 'awsS3',     label: 'S3',        icon: HardDrive,      keywords: ['aws', 's3', 'bucket', 'storage', 'object'] },
      { type: 'awsLambda', label: 'Lambda',    icon: Zap,            keywords: ['aws', 'lambda', 'serverless', 'function'] },
      { type: 'awsRDS',    label: 'RDS',       icon: Database,       keywords: ['aws', 'rds', 'database', 'sql', 'postgres'] },
      { type: 'awsSQS',    label: 'SQS',       icon: MessageSquare,  keywords: ['aws', 'sqs', 'queue', 'message'] },
      { type: 'awsSNS',    label: 'SNS',       icon: Mail,           keywords: ['aws', 'sns', 'notification', 'topic'] },
    ],
  },
  {
    title: 'Google Cloud',
    items: [
      { type: 'gcpCompute',   label: 'Compute Engine',  icon: Cloud,        keywords: ['gcp', 'compute', 'vm', 'instance'] },
      { type: 'gcpStorage',   label: 'Cloud Storage',   icon: Archive,      keywords: ['gcp', 'storage', 'bucket', 'object'] },
      { type: 'gcpFunctions', label: 'Cloud Functions', icon: Zap,          keywords: ['gcp', 'functions', 'serverless'] },
      { type: 'gcpBigQuery',  label: 'BigQuery',        icon: BrainCircuit, keywords: ['gcp', 'bigquery', 'analytics', 'warehouse'] },
      { type: 'gcpPubSub',    label: 'Pub/Sub',         icon: Radio,        keywords: ['gcp', 'pubsub', 'message', 'event'] },
    ],
  },
  {
    title: 'Azure',
    items: [
      { type: 'azureVM',         label: 'Virtual Machine',  icon: Monitor,     keywords: ['azure', 'vm', 'compute', 'instance'] },
      { type: 'azureBlob',       label: 'Blob Storage',     icon: Container,   keywords: ['azure', 'blob', 'storage', 'object'] },
      { type: 'azureFunctions',  label: 'Functions',        icon: Zap,         keywords: ['azure', 'functions', 'serverless'] },
      { type: 'azureSQL',        label: 'SQL Database',     icon: DatabaseZap, keywords: ['azure', 'sql', 'database'] },
      { type: 'azureServiceBus', label: 'Service Bus',      icon: Bus,         keywords: ['azure', 'servicebus', 'message', 'queue'] },
    ],
  },
  {
    title: 'Kubernetes',
    items: [
      { type: 'k8sPod',        label: 'Pod',         icon: Box,      keywords: ['k8s', 'pod', 'container', 'kubernetes'] },
      { type: 'k8sService',    label: 'Service',     icon: Webhook,  keywords: ['k8s', 'service', 'loadbalancer', 'kubernetes'] },
      { type: 'k8sDeployment', label: 'Deployment',  icon: Layers,   keywords: ['k8s', 'deployment', 'rollout', 'kubernetes'] },
      { type: 'k8sIngress',    label: 'Ingress',     icon: Shield,   keywords: ['k8s', 'ingress', 'route', 'kubernetes'] },
      { type: 'k8sConfigMap',  label: 'ConfigMap',   icon: FileText, keywords: ['k8s', 'configmap', 'config', 'kubernetes'] },
    ],
  },
  {
    title: 'Layout / Annotations',
    items: [
      { type: 'groupBlock',  label: 'Group / VPC',  icon: Square,     keywords: ['group', 'vpc', 'subnet', 'boundary', 'container'] },
      { type: 'stickyNote',  label: 'Sticky Note',  icon: StickyNote, keywords: ['note', 'comment', 'annotation', 'sticky'] },
      { type: 'textBlock',   label: 'Text Block',   icon: Type,       keywords: ['text', 'label', 'description'] },
      { type: 'tableBlock',  label: 'Table',        icon: Table,      keywords: ['table', 'data', 'list', 'matrix'] },
    ],
  },
  {
    title: 'Shapes',
    items: [
      { type: 'shapeRect',    label: 'Rectangle',  icon: Square,     shape: 'rectangle', keywords: ['rectangle', 'shape', 'box'] },
      { type: 'shapeCircle',  label: 'Circle',     icon: Circle,     shape: 'circle',    keywords: ['circle', 'shape', 'oval'] },
      { type: 'shapeDiamond', label: 'Diamond',    icon: Diamond,    shape: 'diamond',   keywords: ['diamond', 'shape', 'decision'] },
      { type: 'shapeArrow',   label: 'Arrow',      icon: ArrowRight, shape: 'arrow',     keywords: ['arrow', 'shape', 'direction'] },
    ],
  },
];

/** Flat list for backward compatibility */
const NODE_TYPES = NODE_CATEGORIES.flatMap((c) => c.items);

export { NODE_CATEGORIES };
export default NODE_TYPES;
