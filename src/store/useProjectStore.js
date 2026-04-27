/**
 * useProjectStore — Project CRUD state management.
 *
 * Uses Firestore when configured, falls back to localStorage.
 * Manages creation, deletion, duplication, renaming, archiving,
 * membership, and role management for projects.
 */
import { create } from 'zustand';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import useAuthStore from './useAuthStore';

const PROJECTS_KEY = 'systemcanvas-projects';

const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'demo-api-key';
};

/** Generate a unique ID */
const generateId = () => `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

/** Default empty canvas state */
const emptyCanvas = () => ({
  pages: [{ id: 'page-1', name: 'Page 1', nodes: [], edges: [], pastStates: [], futureStates: [] }],
  activePageId: 'page-1',
  edgeType: 'smoothstep',
});

/** Template definitions */
const TEMPLATES = [
  {
    id: 'microservice',
    name: 'Microservice Architecture',
    description: 'API Gateway, microservices, database, and message queue',
    icon: '🏗️',
    canvas: {
      pages: [{
        id: 'page-1', name: 'Main', pastStates: [], futureStates: [],
        nodes: [
          { id: 'n1', type: 'userNode', position: { x: 50, y: 200 }, data: { label: 'Client', status: 'healthy', latency: 0 } },
          { id: 'n2', type: 'loadBalancer', position: { x: 250, y: 200 }, data: { label: 'Load Balancer', status: 'healthy', latency: 0 } },
          { id: 'n3', type: 'apiGateway', position: { x: 450, y: 200 }, data: { label: 'API Gateway', status: 'healthy', latency: 0 } },
          { id: 'n4', type: 'microservice', position: { x: 700, y: 100 }, data: { label: 'User Service', status: 'healthy', latency: 0 } },
          { id: 'n5', type: 'microservice', position: { x: 700, y: 300 }, data: { label: 'Order Service', status: 'healthy', latency: 0 } },
          { id: 'n6', type: 'database', position: { x: 950, y: 100 }, data: { label: 'Users DB', status: 'healthy', latency: 0 } },
          { id: 'n7', type: 'database', position: { x: 950, y: 300 }, data: { label: 'Orders DB', status: 'healthy', latency: 0 } },
          { id: 'n8', type: 'messageQueue', position: { x: 700, y: 500 }, data: { label: 'Event Bus', status: 'healthy', latency: 0 } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'n2', target: 'n3', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e3', source: 'n3', target: 'n4', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e4', source: 'n3', target: 'n5', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e5', source: 'n4', target: 'n6', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e6', source: 'n5', target: 'n7', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e7', source: 'n5', target: 'n8', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
        ],
      }],
      activePageId: 'page-1',
      edgeType: 'smoothstep',
    },
  },
  {
    id: 'ml-pipeline',
    name: 'ML Pipeline',
    description: 'Data ingestion, model training, and inference',
    icon: '🤖',
    canvas: {
      pages: [{
        id: 'page-1', name: 'Pipeline', pastStates: [], futureStates: [],
        nodes: [
          { id: 'n1', type: 'database', position: { x: 50, y: 200 }, data: { label: 'Data Lake', status: 'healthy', latency: 0 } },
          { id: 'n2', type: 'microservice', position: { x: 300, y: 200 }, data: { label: 'ETL Pipeline', status: 'healthy', latency: 0 } },
          { id: 'n3', type: 'aiModelNode', position: { x: 550, y: 100 }, data: { label: 'Training Job', status: 'healthy', latency: 0 } },
          { id: 'n4', type: 'vectorDbNode', position: { x: 550, y: 300 }, data: { label: 'Feature Store', status: 'healthy', latency: 0 } },
          { id: 'n5', type: 'llmNode', position: { x: 800, y: 200 }, data: { label: 'Inference API', status: 'healthy', latency: 0 } },
          { id: 'n6', type: 'cache', position: { x: 1050, y: 200 }, data: { label: 'Results Cache', status: 'healthy', latency: 0 } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'n2', target: 'n3', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e3', source: 'n2', target: 'n4', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e4', source: 'n3', target: 'n5', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e5', source: 'n4', target: 'n5', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e6', source: 'n5', target: 'n6', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
        ],
      }],
      activePageId: 'page-1',
      edgeType: 'smoothstep',
    },
  },
  {
    id: 'cloud-infra',
    name: 'Cloud Infrastructure',
    description: 'AWS-based multi-tier web application',
    icon: '☁️',
    canvas: {
      pages: [{
        id: 'page-1', name: 'Infrastructure', pastStates: [], futureStates: [],
        nodes: [
          { id: 'n1', type: 'userNode', position: { x: 50, y: 250 }, data: { label: 'Users', status: 'healthy', latency: 0 } },
          { id: 'n2', type: 'cdnNode', position: { x: 250, y: 250 }, data: { label: 'CloudFront', status: 'healthy', latency: 0 } },
          { id: 'n3', type: 'awsEC2', position: { x: 500, y: 150 }, data: { label: 'Web Servers', status: 'healthy', latency: 0 } },
          { id: 'n4', type: 'awsLambda', position: { x: 500, y: 350 }, data: { label: 'Lambda Functions', status: 'healthy', latency: 0 } },
          { id: 'n5', type: 'awsRDS', position: { x: 750, y: 150 }, data: { label: 'RDS PostgreSQL', status: 'healthy', latency: 0 } },
          { id: 'n6', type: 'awsS3', position: { x: 750, y: 350 }, data: { label: 'S3 Assets', status: 'healthy', latency: 0 } },
          { id: 'n7', type: 'awsSQS', position: { x: 500, y: 500 }, data: { label: 'SQS Queue', status: 'healthy', latency: 0 } },
        ],
        edges: [
          { id: 'e1', source: 'n1', target: 'n2', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e2', source: 'n2', target: 'n3', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e3', source: 'n2', target: 'n4', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e4', source: 'n3', target: 'n5', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e5', source: 'n4', target: 'n6', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
          { id: 'e6', source: 'n4', target: 'n7', animated: true, type: 'smoothstep', style: { stroke: '#6366f1', strokeWidth: 2 } },
        ],
      }],
      activePageId: 'page-1',
      edgeType: 'smoothstep',
    },
  },
];

const useProjectStore = create((set, get) => {
  /* ---- localStorage helpers ---- */
  const loadLocal = () => {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  };
  const saveLocal = (projects) => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  };

  return {
    projects: [],
    loading: false,
    templates: TEMPLATES,

    /* ---- Fetch all projects for current user ---- */
    fetchProjects: async () => {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      if (!user) { set({ loading: false }); return; }

      if (isFirebaseConfigured()) {
        try {
          const q = query(collection(db, 'projects'), orderBy('updatedAt', 'desc'));
          const snap = await getDocs(q);
          const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          // Filter: owned by user or user is a member
          const mine = all.filter(
            (p) => p.ownerId === user.uid || (p.members && p.members[user.uid])
          );
          set({ projects: mine, loading: false });
          return;
        } catch (err) {
          console.warn('Firestore fetch failed, using localStorage:', err.message);
        }
      }
      // Demo mode
      const all = loadLocal();
      const mine = all.filter(
        (p) => p.ownerId === user.uid || (p.members && p.members[user.uid])
      );
      set({ projects: mine, loading: false });
    },

    /* ---- Create new project ---- */
    createProject: async (name, templateId = null) => {
      const user = useAuthStore.getState().user;
      if (!user) return null;

      const id = generateId();
      const template = templateId ? TEMPLATES.find((t) => t.id === templateId) : null;
      const canvas = template ? JSON.parse(JSON.stringify(template.canvas)) : emptyCanvas();

      const project = {
        id,
        name: name || 'Untitled Project',
        ownerId: user.uid,
        ownerName: user.name || user.email,
        ownerEmail: user.email,
        members: {
          [user.uid]: { name: user.name || 'User', email: user.email, role: 'owner', joinedAt: new Date().toISOString() },
        },
        canvas,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        template: !!templateId,
      };

      if (isFirebaseConfigured()) {
        try {
          await setDoc(doc(db, 'projects', id), {
            ...project,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          console.warn('Firestore create failed:', err.message);
        }
      }

      // Always save locally too
      const local = loadLocal();
      local.unshift(project);
      saveLocal(local);

      set((s) => ({ projects: [project, ...s.projects] }));
      return id;
    },

    /* ---- Delete project ---- */
    deleteProject: async (id) => {
      const user = useAuthStore.getState().user;
      const project = get().projects.find((p) => p.id === id);
      if (!project || project.ownerId !== user?.uid) return false;

      if (isFirebaseConfigured()) {
        try { await deleteDoc(doc(db, 'projects', id)); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().filter((p) => p.id !== id);
      saveLocal(local);
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
      return true;
    },

    /* ---- Rename project ---- */
    renameProject: async (id, name) => {
      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', id), { name, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p)) }));
    },

    /* ---- Duplicate project ---- */
    duplicateProject: async (id) => {
      const project = get().projects.find((p) => p.id === id);
      if (!project) return null;
      return get().createProject(`${project.name} (Copy)`, null).then(async (newId) => {
        if (newId) {
          const canvas = JSON.parse(JSON.stringify(project.canvas));
          await get().saveCanvas(newId, canvas);
        }
        return newId;
      });
    },

    /* ---- Archive / Unarchive ---- */
    archiveProject: async (id) => {
      const project = get().projects.find((p) => p.id === id);
      if (!project) return;
      const newStatus = project.status === 'archived' ? 'active' : 'archived';
      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', id), { status: newStatus, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === id ? { ...p, status: newStatus } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, status: newStatus } : p)) }));
    },

    /* ---- Leave project (non-owner) ---- */
    leaveProject: async (id) => {
      const user = useAuthStore.getState().user;
      if (!user) return;
      const project = get().projects.find((p) => p.id === id);
      if (!project || project.ownerId === user.uid) return; // Can't leave own project

      const members = { ...project.members };
      delete members[user.uid];

      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', id), { members, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === id ? { ...p, members } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.filter((p) => p.id !== id) }));
    },

    /* ---- Save canvas state ---- */
    saveCanvas: async (id, canvas) => {
      if (isFirebaseConfigured()) {
        try {
          await updateDoc(doc(db, 'projects', id), { canvas, updatedAt: serverTimestamp() });
        } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) =>
        p.id === id ? { ...p, canvas, updatedAt: new Date().toISOString() } : p
      );
      saveLocal(local);
      set((s) => ({
        projects: s.projects.map((p) =>
          p.id === id ? { ...p, canvas, updatedAt: new Date().toISOString() } : p
        ),
      }));
    },

    /* ---- Load project by ID ---- */
    loadProject: async (id) => {
      if (isFirebaseConfigured()) {
        try {
          const snap = await getDoc(doc(db, 'projects', id));
          if (snap.exists()) return { id: snap.id, ...snap.data() };
        } catch (e) { console.warn(e); }
      }
      const local = loadLocal();
      return local.find((p) => p.id === id) || null;
    },

    /* ---- Invite member ---- */
    inviteMember: async (projectId, email, name, role = 'editor') => {
      const user = useAuthStore.getState().user;
      const project = get().projects.find((p) => p.id === projectId);
      if (!project || project.ownerId !== user?.uid) return false;

      const memberId = `invited-${email.replace(/[^a-zA-Z0-9]/g, '-')}`;
      const members = {
        ...project.members,
        [memberId]: { name: name || email, email, role, joinedAt: new Date().toISOString() },
      };

      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', projectId), { members, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === projectId ? { ...p, members } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.map((p) => (p.id === projectId ? { ...p, members } : p)) }));
      return true;
    },

    /* ---- Change member role ---- */
    changeMemberRole: async (projectId, memberId, newRole) => {
      const user = useAuthStore.getState().user;
      const project = get().projects.find((p) => p.id === projectId);
      if (!project || project.ownerId !== user?.uid) return false;
      if (memberId === user.uid) return false; // Can't change own role

      const members = { ...project.members };
      if (members[memberId]) {
        members[memberId] = { ...members[memberId], role: newRole };
      }

      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', projectId), { members, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === projectId ? { ...p, members } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.map((p) => (p.id === projectId ? { ...p, members } : p)) }));
      return true;
    },

    /* ---- Remove member ---- */
    removeMember: async (projectId, memberId) => {
      const user = useAuthStore.getState().user;
      const project = get().projects.find((p) => p.id === projectId);
      if (!project || project.ownerId !== user?.uid) return false;

      const members = { ...project.members };
      delete members[memberId];

      if (isFirebaseConfigured()) {
        try { await updateDoc(doc(db, 'projects', projectId), { members, updatedAt: serverTimestamp() }); } catch (e) { console.warn(e); }
      }
      const local = loadLocal().map((p) => (p.id === projectId ? { ...p, members } : p));
      saveLocal(local);
      set((s) => ({ projects: s.projects.map((p) => (p.id === projectId ? { ...p, members } : p)) }));
      return true;
    },

    /* ---- Get user's role in a project ---- */
    getUserRole: (projectId) => {
      const user = useAuthStore.getState().user;
      const project = get().projects.find((p) => p.id === projectId);
      if (!project || !user) return null;
      if (project.ownerId === user.uid) return 'owner';
      const member = project.members?.[user.uid];
      return member?.role || null;
    },
  };
});

export default useProjectStore;
