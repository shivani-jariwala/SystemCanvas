/**
 * NODE_TYPES — master list of system component types.
 *
 * Organized into categories for the sidebar.
 * Each entry drives palette rendering, drag-and-drop creation,
 * and custom node resolution.
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
 * Categories for the sidebar. Each has a title and list of node types.
 */
const NODE_CATEGORIES = [
  {
    title: 'Network & Edge',
    items: [
      { type: 'userNode',      label: 'User / Browser', icon: User },
      { type: 'dnsNode',       label: 'DNS',            icon: Router },
      { type: 'cdnNode',       label: 'CDN',            icon: Globe },
      { type: 'apiGateway',    label: 'API Gateway',    icon: Network },
      { type: 'loadBalancer',  label: 'Load Balancer',  icon: Network },
    ],
  },
  {
    title: 'Compute & Logic',
    items: [
      { type: 'microservice',  label: 'Microservice',   icon: Boxes },
    ],
  },
  {
    title: 'Data & State',
    items: [
      { type: 'database',      label: 'Database',       icon: Database },
      { type: 'cache',         label: 'Cache',          icon: MemoryStick },
      { type: 'messageQueue',  label: 'Message Queue',  icon: MessageSquare },
    ],
  },
  {
    title: 'AI & Machine Learning',
    items: [
      { type: 'aiModelNode',   label: 'AI Model',       icon: Bot },
      { type: 'llmNode',       label: 'LLM Engine',     icon: Sparkles },
      { type: 'vectorDbNode',  label: 'Vector DB',      icon: Database },
    ],
  },
  {
    title: 'Layout & Annotations',
    items: [
      { type: 'groupBlock',  label: 'Group / VPC',  icon: Square },
      { type: 'stickyNote',  label: 'Sticky Note',  icon: StickyNote },
      { type: 'textBlock',   label: 'Text Block',   icon: Type },
      { type: 'tableBlock',  label: 'Table',        icon: Table },
    ],
  },
  {
    title: 'Shapes',
    items: [
      { type: 'shapeRect',    label: 'Rectangle',  icon: Square,     shape: 'rectangle' },
      { type: 'shapeCircle',  label: 'Circle',     icon: Circle,     shape: 'circle' },
      { type: 'shapeDiamond', label: 'Diamond',    icon: Diamond,    shape: 'diamond' },
      { type: 'shapeArrow',   label: 'Arrow',      icon: ArrowRight, shape: 'arrow' },
    ],
  },
  {
    title: 'AWS',
    items: [
      { type: 'awsEC2',    label: 'EC2',       icon: Server },
      { type: 'awsS3',     label: 'S3',        icon: HardDrive },
      { type: 'awsLambda', label: 'Lambda',    icon: Zap },
      { type: 'awsRDS',    label: 'RDS',       icon: Database },
      { type: 'awsSQS',    label: 'SQS',       icon: MessageSquare },
      { type: 'awsSNS',    label: 'SNS',       icon: Mail },
    ],
  },
  {
    title: 'Google Cloud',
    items: [
      { type: 'gcpCompute',   label: 'Compute Engine',  icon: Cloud },
      { type: 'gcpStorage',   label: 'Cloud Storage',   icon: Archive },
      { type: 'gcpFunctions', label: 'Cloud Functions', icon: Zap },
      { type: 'gcpBigQuery',  label: 'BigQuery',        icon: BrainCircuit },
      { type: 'gcpPubSub',    label: 'Pub/Sub',         icon: Radio },
    ],
  },
  {
    title: 'Azure',
    items: [
      { type: 'azureVM',         label: 'Virtual Machine',  icon: Monitor },
      { type: 'azureBlob',       label: 'Blob Storage',     icon: Container },
      { type: 'azureFunctions',  label: 'Functions',        icon: Zap },
      { type: 'azureSQL',        label: 'SQL Database',     icon: DatabaseZap },
      { type: 'azureServiceBus', label: 'Service Bus',      icon: Bus },
    ],
  },
  {
    title: 'Kubernetes',
    items: [
      { type: 'k8sPod',        label: 'Pod',         icon: Box },
      { type: 'k8sService',    label: 'Service',     icon: Webhook },
      { type: 'k8sDeployment', label: 'Deployment',  icon: Layers },
      { type: 'k8sIngress',    label: 'Ingress',     icon: Shield },
      { type: 'k8sConfigMap',  label: 'ConfigMap',   icon: FileText },
    ],
  },
];

/** Flat list for backward compatibility */
const NODE_TYPES = NODE_CATEGORIES.flatMap((c) => c.items);

export { NODE_CATEGORIES };
export default NODE_TYPES;
