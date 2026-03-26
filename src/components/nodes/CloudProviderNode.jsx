/**
 * CloudProviderNode — Factory for cloud provider service nodes.
 *
 * Uses the BaseNode shell with provider-specific theming.
 * The icon is looked up from NODE_TYPES at definition time.
 */
import BaseNode from './BaseNode';
import NODE_TYPES from '../../constants/nodeTypes';

/** Provider color schemes */
const providerThemes = {
  // AWS — orange
  awsEC2:         { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  awsS3:          { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  awsLambda:      { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  awsRDS:         { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  awsSQS:         { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  awsSNS:         { accentColor: 'bg-orange-400',  bgColor: 'bg-orange-500/15' },
  // GCP — blue
  gcpCompute:     { accentColor: 'bg-blue-400',    bgColor: 'bg-blue-500/15' },
  gcpStorage:     { accentColor: 'bg-blue-400',    bgColor: 'bg-blue-500/15' },
  gcpFunctions:   { accentColor: 'bg-blue-400',    bgColor: 'bg-blue-500/15' },
  gcpBigQuery:    { accentColor: 'bg-blue-400',    bgColor: 'bg-blue-500/15' },
  gcpPubSub:      { accentColor: 'bg-blue-400',    bgColor: 'bg-blue-500/15' },
  // Azure — cyan
  azureVM:        { accentColor: 'bg-cyan-400',    bgColor: 'bg-cyan-500/15' },
  azureBlob:      { accentColor: 'bg-cyan-400',    bgColor: 'bg-cyan-500/15' },
  azureFunctions: { accentColor: 'bg-cyan-400',    bgColor: 'bg-cyan-500/15' },
  azureSQL:       { accentColor: 'bg-cyan-400',    bgColor: 'bg-cyan-500/15' },
  azureServiceBus:{ accentColor: 'bg-cyan-400',    bgColor: 'bg-cyan-500/15' },
  // Kubernetes — indigo
  k8sPod:         { accentColor: 'bg-indigo-400',  bgColor: 'bg-indigo-500/15' },
  k8sService:     { accentColor: 'bg-indigo-400',  bgColor: 'bg-indigo-500/15' },
  k8sDeployment:  { accentColor: 'bg-indigo-400',  bgColor: 'bg-indigo-500/15' },
  k8sIngress:     { accentColor: 'bg-indigo-400',  bgColor: 'bg-indigo-500/15' },
  k8sConfigMap:   { accentColor: 'bg-indigo-400',  bgColor: 'bg-indigo-500/15' },
};

/** Factory to create provider-specific node components */
export function createCloudNode(type) {
  const theme = providerThemes[type] || { accentColor: 'bg-gray-400', bgColor: 'bg-gray-500/15' };
  const nodeTypeDef = NODE_TYPES.find((n) => n.type === type);
  const Icon = nodeTypeDef?.icon;

  function CloudNode(props) {
    return (
      <BaseNode
        {...props}
        icon={Icon}
        accentColor={theme.accentColor}
        bgColor={theme.bgColor}
      />
    );
  }
  CloudNode.displayName = `CloudNode_${type}`;
  return CloudNode;
}
