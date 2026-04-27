/**
 * MembersPanel — Slide-out panel showing project members,
 * with role management and removal controls.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Shield, Crown, Eye, Pencil, Trash2, LogOut } from 'lucide-react';
import useProjectStore from '../store/useProjectStore';
import useAuthStore from '../store/useAuthStore';
import ConfirmDialog from './ui/ConfirmDialog';
import toast from 'react-hot-toast';

const ROLE_CONFIG = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/15' },
  editor: { label: 'Editor', icon: Pencil, color: 'text-blue-400', bg: 'bg-blue-500/15' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-gray-400', bg: 'bg-gray-500/15' },
};

function MembersPanel({ isOpen, onClose, projectId }) {
  const user = useAuthStore((s) => s.user);
  const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId));
  const changeMemberRole = useProjectStore((s) => s.changeMemberRole);
  const removeMember = useProjectStore((s) => s.removeMember);
  const leaveProject = useProjectStore((s) => s.leaveProject);

  const [confirmAction, setConfirmAction] = useState(null);

  if (!isOpen || !project) return null;

  const members = project.members || {};
  const isOwner = project.ownerId === user?.uid;
  const memberEntries = Object.entries(members);

  const handleRoleChange = async (memberId, newRole) => {
    const result = await changeMemberRole(projectId, memberId, newRole);
    if (result) toast.success('Role updated');
    else toast.error('Failed to update role');
  };

  const handleRemove = async (memberId, memberName) => {
    setConfirmAction({
      title: 'Remove Member',
      message: `Are you sure you want to remove ${memberName} from this project? They will lose access immediately.`,
      onConfirm: async () => {
        const result = await removeMember(projectId, memberId);
        if (result) toast.success(`${memberName} removed`);
        else toast.error('Failed to remove member');
      },
    });
  };

  const handleLeave = () => {
    setConfirmAction({
      title: 'Leave Project',
      message: 'Are you sure you want to leave this project? You will lose access and need to be re-invited.',
      onConfirm: async () => {
        await leaveProject(projectId);
        toast.success('You left the project');
        onClose();
      },
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-gray-900 border-l border-gray-700/80 w-full max-w-sm shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15">
                <Users className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-100">Members</h2>
                <p className="text-xs text-gray-500">{memberEntries.length} member{memberEntries.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Members list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {memberEntries.map(([memberId, member]) => {
              const roleConfig = ROLE_CONFIG[member.role] || ROLE_CONFIG.viewer;
              const RoleIcon = roleConfig.icon;
              const isCurrentUser = memberId === user?.uid;
              const isMemberOwner = member.role === 'owner';

              return (
                <div
                  key={memberId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/40 border border-gray-700/30 hover:bg-gray-800/60 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-sm border border-indigo-500/30 flex-shrink-0">
                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-200 truncate">
                        {member.name || member.email}
                      </span>
                      {isCurrentUser && <span className="text-[10px] text-gray-500">(you)</span>}
                    </div>
                    <span className="text-xs text-gray-500 truncate block">{member.email}</span>
                  </div>

                  {/* Role Badge */}
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${roleConfig.bg}`}>
                    <RoleIcon className={`h-3 w-3 ${roleConfig.color}`} />
                    <span className={`text-[10px] font-semibold uppercase tracking-wider ${roleConfig.color}`}>
                      {roleConfig.label}
                    </span>
                  </div>

                  {/* Actions */}
                  {isOwner && !isMemberOwner && !isCurrentUser && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(memberId, e.target.value)}
                        className="text-xs bg-gray-800 border border-gray-700 rounded-md px-1.5 py-1 text-gray-300 cursor-pointer"
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                      <button
                        onClick={() => handleRemove(memberId, member.name)}
                        className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leave button (non-owners) */}
          {!isOwner && (
            <div className="p-4 border-t border-gray-800">
              <button
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Leave Project
              </button>
            </div>
          )}
        </motion.div>

        {confirmAction && (
          <ConfirmDialog
            isOpen={true}
            onClose={() => setConfirmAction(null)}
            onConfirm={confirmAction.onConfirm}
            title={confirmAction.title}
            message={confirmAction.message}
            confirmText="Confirm"
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default MembersPanel;
