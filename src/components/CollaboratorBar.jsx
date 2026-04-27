/**
 * CollaboratorBar — Shows active collaborators in the project header.
 */
import { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import InviteModal from './InviteModal';
import MembersPanel from './MembersPanel';

function CollaboratorBar({ project, isOwner }) {
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  if (!project) return null;

  const members = project.members || {};
  const memberEntries = Object.entries(members);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Member avatars (stacked) */}
        <button
          onClick={() => setShowMembers(true)}
          className="flex items-center -space-x-2 hover:opacity-90 transition-opacity"
          title="View members"
        >
          {memberEntries.slice(0, 4).map(([id, member]) => (
            <div
              key={id}
              className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-800 border-2 border-gray-900 text-xs font-semibold text-gray-300"
              title={`${member.name || member.email} (${member.role})`}
            >
              {member.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          ))}
          {memberEntries.length > 4 && (
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-700 border-2 border-gray-900 text-[10px] font-semibold text-gray-400">
              +{memberEntries.length - 4}
            </div>
          )}
        </button>

        {/* Members button */}
        <button
          onClick={() => setShowMembers(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
          title="View all members"
        >
          <Users className="h-3.5 w-3.5" />
          <span>{memberEntries.length}</span>
        </button>

        {/* Invite button (owner only) */}
        {isOwner && (
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Invite
          </button>
        )}
      </div>

      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} projectId={project.id} />
      <MembersPanel isOpen={showMembers} onClose={() => setShowMembers(false)} projectId={project.id} />
    </>
  );
}

export default CollaboratorBar;
