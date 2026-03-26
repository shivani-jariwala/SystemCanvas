/**
 * NODE_TYPES — master list of system component types.
 *
 * Each entry drives palette rendering, drag-and-drop creation,
 * and custom node resolution.  Kept in its own file so the
 * Sidebar component only exports React components (required
 * by react-refresh / Fast Refresh).
 */
import {
  Globe,
  Network,
  Boxes,
  MessageSquare,
  Database,
  MemoryStick,
} from 'lucide-react';

const NODE_TYPES = [
  { type: 'apiGateway',    label: 'API Gateway',    icon: Globe },
  { type: 'loadBalancer',  label: 'Load Balancer',  icon: Network },
  { type: 'microservice',  label: 'Microservice',   icon: Boxes },
  { type: 'messageQueue',  label: 'Message Queue',  icon: MessageSquare },
  { type: 'database',      label: 'Database',       icon: Database },
  { type: 'cache',         label: 'Cache',          icon: MemoryStick },
];

export default NODE_TYPES;
