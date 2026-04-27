/**
 * Dashboard — Post-login landing page for project management.
 *
 * Shows all projects (owned + shared), search/sort, CRUD operations,
 * templates, and empty state for first-time users.
 */
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Plus, Search, MoreHorizontal, Trash2, Copy, PenLine,
  Archive, LogOut, FolderOpen, Clock, Users, Crown, Pencil, Eye,
  ArrowUpDown, Grid3x3, List, ChevronDown, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import useAuthStore from '../store/useAuthStore';
import useProjectStore from '../store/useProjectStore';
import ConfirmDialog from './ui/ConfirmDialog';
import EmptyState from './ui/EmptyState';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ROLE_BADGES = {
  owner: { label: 'Owner', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  editor: { label: 'Editor', icon: Pencil, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  viewer: { label: 'Viewer', icon: Eye, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20' },
};

function ProjectCard({ project, onOpen, onRename, onDuplicate, onArchive, onDelete, onLeave }) {
  const [showMenu, setShowMenu] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isOwner = project.ownerId === user?.uid;
  const memberRole = project.members?.[user?.uid]?.role || (isOwner ? 'owner' : 'viewer');
  const roleBadge = ROLE_BADGES[memberRole] || ROLE_BADGES.viewer;
  const RoleBadgeIcon = roleBadge.icon;
  const memberCount = Object.keys(project.members || {}).length;

  const updatedLabel = (() => {
    try {
      return formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });
    } catch {
      return 'recently';
    }
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="group relative bg-gray-900/70 border border-gray-800/80 rounded-xl hover:border-gray-700/80 hover:bg-gray-800/50 transition-all duration-200 overflow-hidden cursor-pointer"
      onClick={() => onOpen(project.id)}
    >
      {/* Canvas preview gradient */}
      <div className="h-28 bg-gradient-to-br from-gray-800/40 via-indigo-950/20 to-gray-900/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.08),transparent_70%)]" />
        <div className="absolute bottom-2 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-900/60 backdrop-blur-sm border border-gray-700/40">
          <div className={`h-1.5 w-1.5 rounded-full ${project.status === 'archived' ? 'bg-gray-500' : 'bg-emerald-400'}`} />
          <span className="text-[10px] text-gray-400 capitalize">{project.status || 'active'}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-100 truncate group-hover:text-white transition-colors">
              {project.name}
            </h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Clock className="h-3 w-3" />
                {updatedLabel}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-gray-500">
                <Users className="h-3 w-3" />
                {memberCount}
              </span>
            </div>
          </div>

          {/* Role Badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${roleBadge.bg} flex-shrink-0`}>
            <RoleBadgeIcon className={`h-3 w-3 ${roleBadge.color}`} />
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${roleBadge.color}`}>
              {roleBadge.label}
            </span>
          </div>
        </div>

        {/* Owner */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-semibold">
            {project.ownerName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <span className="truncate">{isOwner ? 'You' : project.ownerName || 'Unknown'}</span>
        </div>
      </div>

      {/* Overflow menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1.5 rounded-lg bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              className="absolute right-0 top-9 z-50 w-48 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl overflow-hidden py-1.5"
              onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
            >
              <button onClick={() => onOpen(project.id)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left">
                <FolderOpen className="h-4 w-4 text-gray-400" /> Open
              </button>
              {isOwner && (
                <button onClick={() => onRename(project)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left">
                  <PenLine className="h-4 w-4 text-gray-400" /> Rename
                </button>
              )}
              <button onClick={() => onDuplicate(project.id)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left">
                <Copy className="h-4 w-4 text-gray-400" /> Duplicate
              </button>
              {isOwner && (
                <button onClick={() => onArchive(project.id)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-left">
                  <Archive className="h-4 w-4 text-gray-400" /> {project.status === 'archived' ? 'Unarchive' : 'Archive'}
                </button>
              )}
              <div className="h-px bg-gray-800 my-1 mx-2" />
              {isOwner ? (
                <button onClick={() => onDelete(project)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              ) : (
                <button onClick={() => onLeave(project)} className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left">
                  <LogOut className="h-4 w-4" /> Leave Project
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function NewProjectModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const templates = useProjectStore((s) => s.templates);

  const handleCreate = () => {
    if (!name.trim() && !selectedTemplate) return;
    onCreate(name.trim() || selectedTemplate?.name || 'Untitled Project', selectedTemplate?.id || null);
    setName('');
    setSelectedTemplate(null);
    onClose();
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
          className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-gray-100">Create New Project</h2>
            <p className="text-sm text-gray-500 mt-1">Start from scratch or use a template</p>
          </div>

          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                className="w-full px-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-500"
                placeholder="My Architecture"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Templates (optional)</label>
              <div className="grid grid-cols-1 gap-2">
                {templates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(selectedTemplate?.id === t.id ? null : t)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedTemplate?.id === t.id
                        ? 'border-indigo-500/50 bg-indigo-500/10'
                        : 'border-gray-700/50 bg-gray-800/40 hover:bg-gray-800/60'
                    }`}
                  >
                    <span className="text-xl">{t.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-200">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800 bg-gray-900/50">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-all shadow-lg shadow-indigo-500/20"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function RenameModal({ project, onClose, onRename }) {
  const [name, setName] = useState(project?.name || '');

  if (!project) return null;

  const handleSubmit = () => {
    if (name.trim()) {
      onRename(project.id, name.trim());
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-100">Rename Project</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full px-4 py-2.5 rounded-lg bg-gray-800/70 border border-gray-700 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-800">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">Rename</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { projects, loading, fetchProjects, createProject, deleteProject, duplicateProject, renameProject, archiveProject, leaveProject } = useProjectStore();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [tab, setTab] = useState('all');
  const [showNewProject, setShowNewProject] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmLeave, setConfirmLeave] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // Tab filter
    if (tab === 'owned') result = result.filter((p) => p.ownerId === user?.uid);
    if (tab === 'shared') result = result.filter((p) => p.ownerId !== user?.uid);
    if (tab === 'archived') result = result.filter((p) => p.status === 'archived');
    if (tab !== 'archived') result = result.filter((p) => p.status !== 'archived');

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name?.toLowerCase().includes(q) || p.ownerName?.toLowerCase().includes(q));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      return new Date(b[sortBy] || 0) - new Date(a[sortBy] || 0);
    });

    return result;
  }, [projects, tab, search, sortBy, user]);

  const handleCreate = async (name, templateId) => {
    const id = await createProject(name, templateId);
    if (id) {
      toast.success('Project created');
      navigate(`/project/${id}`);
    }
  };

  const handleDelete = async (project) => {
    setConfirmDelete(project);
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete) return;
    const result = await deleteProject(confirmDelete.id);
    if (result) toast.success('Project deleted');
    else toast.error('Failed to delete project');
    setConfirmDelete(null);
  };

  const handleDuplicate = async (id) => {
    const newId = await duplicateProject(id);
    if (newId) toast.success('Project duplicated');
    else toast.error('Failed to duplicate');
  };

  const handleArchive = async (id) => {
    await archiveProject(id);
    toast.success('Project archived');
  };

  const handleRename = async (id, name) => {
    await renameProject(id, name);
    toast.success('Project renamed');
  };

  const handleLeave = async (project) => {
    setConfirmLeave(project);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-950 text-gray-100 overflow-hidden">
      {/* Top nav */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-500/15">
            <LayoutDashboard className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-100 leading-tight">SystemCanvas</h1>
            <p className="text-[10px] text-gray-500 leading-tight">Workflow Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
          >
            <Plus className="h-4 w-4" />
            New Project
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-800/60 transition-colors"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-500/20 text-indigo-400 font-semibold text-sm border border-indigo-500/30">
                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-200 leading-tight truncate max-w-[120px]">{user?.name || 'User'}</p>
                <p className="text-[10px] text-gray-500 leading-tight truncate max-w-[120px]">{user?.email}</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -4 }}
                    className="absolute right-0 top-12 z-50 w-48 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl overflow-hidden py-1.5"
                  >
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Welcome heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.name?.split(' ')[0] || 'there'}</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Manage your architecture projects and workflows</p>
          </div>

          {/* Tabs + Search + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-1 bg-gray-900/60 rounded-xl p-1 border border-gray-800/60">
              {[
                { key: 'all', label: 'All Projects' },
                { key: 'owned', label: 'My Projects' },
                { key: 'shared', label: 'Shared' },
                { key: 'archived', label: 'Archived' },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    tab === t.key ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-900/60 border border-gray-800/60 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
                />
              </div>
              <button
                onClick={() => setSortBy(sortBy === 'updatedAt' ? 'name' : 'updatedAt')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 bg-gray-900/60 border border-gray-800/60 rounded-lg hover:bg-gray-800 transition-colors"
                title={`Sort by ${sortBy === 'updatedAt' ? 'name' : 'last updated'}`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                {sortBy === 'updatedAt' ? 'Recent' : 'Name'}
              </button>
            </div>
          </div>

          {/* Project grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <LoadingSpinner label="Loading projects..." />
            </div>
          ) : filteredProjects.length === 0 ? (
            projects.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title="Create your first project"
                description="Start building beautiful system architecture diagrams with drag-and-drop components, real-time collaboration, and professional export options."
                actionLabel="Create Project"
                onAction={() => setShowNewProject(true)}
              />
            ) : (
              <EmptyState
                icon={Search}
                title="No projects found"
                description={search ? `No projects matching "${search}"` : 'No projects in this category'}
              />
            )
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredProjects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    onOpen={(id) => navigate(`/project/${id}`)}
                    onRename={(proj) => setRenaming(proj)}
                    onDuplicate={handleDuplicate}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    onLeave={handleLeave}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <NewProjectModal isOpen={showNewProject} onClose={() => setShowNewProject(false)} onCreate={handleCreate} />
      {renaming && <RenameModal project={renaming} onClose={() => setRenaming(null)} onRename={handleRename} />}
      <ConfirmDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteAction}
        title="Delete Project"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
      />
      <ConfirmDialog
        isOpen={!!confirmLeave}
        onClose={() => setConfirmLeave(null)}
        onConfirm={async () => {
          await leaveProject(confirmLeave.id);
          toast.success('You left the project');
          setConfirmLeave(null);
        }}
        title="Leave Project"
        message={`Are you sure you want to leave "${confirmLeave?.name}"? You'll need to be re-invited to access it again.`}
        confirmText="Leave"
        variant="warning"
      />
    </div>
  );
}

export default Dashboard;
