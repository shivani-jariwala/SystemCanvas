/**
 * ProjectWorkspace — Wraps the canvas layout within a project context.
 *
 * Loads project data, provides permission context, shows project header
 * with collaborators, handles autosave, and reads/writes canvas state.
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from '@xyflow/react';
import {
  ArrowLeft, Save, LayoutDashboard, Eye,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import Inspector from './Inspector';
import CollaboratorBar from './CollaboratorBar';
import useCanvasStore from '../store/useCanvasStore';
import useProjectStore from '../store/useProjectStore';
import useAuthStore from '../store/useAuthStore';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';

const AUTOSAVE_DELAY = 3000; // 3 seconds

function ProjectWorkspace() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const loadProject = useProjectStore((s) => s.loadProject);
  const saveCanvas = useProjectStore((s) => s.saveCanvas);
  const projects = useProjectStore((s) => s.projects);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autosaveTimer = useRef(null);
  const initialLoad = useRef(true);

  // Determine user's role
  const userRole = (() => {
    if (!project || !user) return 'viewer';
    if (project.ownerId === user.uid) return 'owner';
    const member = project.members?.[user.uid];
    return member?.role || 'viewer';
  })();

  const isReadOnly = userRole === 'viewer';
  const isOwner = userRole === 'owner';

  // Load project on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const p = await loadProject(projectId);
      if (cancelled) return;
      if (!p) {
        toast.error('Project not found');
        navigate('/');
        return;
      }
      setProject(p);

      // Load canvas state into zustand store
      if (p.canvas) {
        const { pages, activePageId, edgeType } = p.canvas;
        const targetPage = pages?.find((pg) => pg.id === activePageId) || pages?.[0];
        useCanvasStore.setState({
          pages: pages || [],
          activePageId: activePageId || 'page-1',
          nodes: targetPage?.nodes || [],
          edges: targetPage?.edges || [],
          edgeType: edgeType || 'smoothstep',
          pastStates: [],
          futureStates: [],
          selectedNodeId: null,
        });
      }
      initialLoad.current = false;
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [projectId, loadProject, navigate]);

  // Sync project from store when it updates (e.g., after member changes)
  useEffect(() => {
    const updatedProject = projects.find((p) => p.id === projectId);
    if (updatedProject) setProject(updatedProject);
  }, [projects, projectId]);

  // Autosave — debounced canvas state save
  const triggerAutosave = useCallback(() => {
    if (isReadOnly || initialLoad.current) return;
    setHasUnsavedChanges(true);
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(async () => {
      try {
        useCanvasStore.getState()._syncActivePage();
        const { pages, activePageId, edgeType } = useCanvasStore.getState();
        await saveCanvas(projectId, { pages, activePageId, edgeType });
        setHasUnsavedChanges(false);
      } catch (e) {
        console.warn('Autosave failed:', e);
      }
    }, AUTOSAVE_DELAY);
  }, [projectId, saveCanvas, isReadOnly]);

  // Subscribe to canvas store changes for autosave
  useEffect(() => {
    const unsub = useCanvasStore.subscribe(
      (state) => ({ nodes: state.nodes, edges: state.edges }),
      () => {
        if (!initialLoad.current) triggerAutosave();
      },
      { equalityFn: (a, b) => a.nodes === b.nodes && a.edges === b.edges }
    );
    return () => { unsub?.(); if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, [triggerAutosave]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes.';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedChanges]);

  // Manual save
  const handleManualSave = useCallback(async () => {
    useCanvasStore.getState()._syncActivePage();
    const { pages, activePageId, edgeType } = useCanvasStore.getState();
    await saveCanvas(projectId, { pages, activePageId, edgeType });
    setHasUnsavedChanges(false);
    toast.success('Project saved');
  }, [projectId, saveCanvas]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-950">
        <LoadingSpinner size="lg" label="Loading project..." />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-950 text-gray-100">
        {/* Project header */}
        <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-900/60 backdrop-blur-md flex-shrink-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <LayoutDashboard className="h-3.5 w-3.5" />
            </button>
            <div className="h-4 w-px bg-gray-800" />
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-gray-100 truncate max-w-[200px]">
                {project?.name || 'Untitled'}
              </h1>
              {isReadOnly && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-700/40 border border-gray-600/30">
                  <Eye className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] font-medium text-gray-400 uppercase">View Only</span>
                </div>
              )}
              {hasUnsavedChanges && (
                <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" title="Unsaved changes" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CollaboratorBar project={project} isOwner={isOwner} />

            {!isReadOnly && (
              <button
                onClick={handleManualSave}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-800/60 hover:bg-gray-700/60 border border-gray-700/50 rounded-lg transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </button>
            )}
          </div>
        </header>

        {/* Workspace */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar projectId={projectId} isReadOnly={isReadOnly} />
          <Canvas projectId={projectId} isReadOnly={isReadOnly} onCanvasChange={triggerAutosave} />
          <Inspector isReadOnly={isReadOnly} />
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default ProjectWorkspace;
