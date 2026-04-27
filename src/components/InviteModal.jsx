/**
 * InviteModal — Invite collaborators to a project.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Mail, Shield } from 'lucide-react';
import useProjectStore from '../store/useProjectStore';
import toast from 'react-hot-toast';

function InviteModal({ isOpen, onClose, projectId }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('editor');
  const [loading, setLoading] = useState(false);

  const inviteMember = useProjectStore((s) => s.inviteMember);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const result = await inviteMember(projectId, email.trim(), name.trim(), role);
    setLoading(false);

    if (result) {
      toast.success(`Invited ${email.trim()} as ${role}`);
      setEmail('');
      setName('');
      setRole('editor');
      onClose();
    } else {
      toast.error('Failed to invite member');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/15">
                <UserPlus className="h-4 w-4 text-indigo-400" />
              </div>
              <h2 className="text-base font-semibold text-gray-100">Invite Collaborator</h2>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleInvite} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  placeholder="collaborator@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none cursor-pointer"
                >
                  <option value="editor">Editor — Can modify workflows</option>
                  <option value="viewer">Viewer — Read-only access</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full flex items-center justify-center gap-2 py-2.5 mt-2 rounded-lg font-medium text-sm bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <UserPlus className="h-4 w-4" />
              {loading ? 'Inviting...' : 'Send Invitation'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default InviteModal;
