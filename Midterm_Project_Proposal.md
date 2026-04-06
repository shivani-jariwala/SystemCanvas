CMPE 280 — Midterm Project Proposal Template
**Team Name:** [Your Team Name]
**Members:** [Full Names + SJSU Emails]
**Project Track:** Advanced SPA

1. Project Title & Overview
**SystemCanvas: Professional Architecture Design & Visualizer SPA**
An advanced, developer-centric Single Page Application (SPA) for designing, visualizing, and managing system architectures with professional-grade diagramming tools, tailored specifically for software engineers and systems architects.

2. Problem Statement (Why)
**What user problem or opportunity does your project address?**
Existing system design tools are often either too generic (like basic whiteboards) or overly complex and lack native understanding of modern software architecture components. Developers and architects need a fast, intuitive, and developer-friendly tool that caters specifically to backend and cloud architecture requirements (compute, network, data, AI).
**Why is it meaningful, valuable, or interesting?**
By creating a highly tailored, architecture-oriented system design tool, we empower engineering teams to rapidly prototype, communicate, and document their infrastructure. A professional-grade UI with features like orthogonal edge routing, intelligent component segregation, and workspace management significantly reduces friction in the design phase, bridging the gap between abstract ideas and concrete technical plans.

3. Scope & Features (What)
- **Core Features (must-have by Dec 4)**
   - **Interactive Diagramming Canvas:** Drag-and-drop interface with advanced orthogonal edge routing, edge snapping, and alignment/distribution capabilities.
   - **Categorized Component Library:** Logical segregation of nodes for Network, Compute, Data, and AI components tailored for cloud architectures.
   - **Multi-Tab Workspace Management:** Support for multiple active diagrams in a single session context, enabling modular complex designs.
   - **Developer-Centric Controls:** Right-click context menus, extensive keyboard shortcuts, and minimap navigation for improved usability.
- **Stretch Goals (nice-to-have)**
   - **User Authentication & Cloud Sync:** Real user authentication to securely save, sync, and collaborate on workspaces.
   - **AI-Enhanced Workflow:** AI-assisted architectural suggestions or automated clean-up of diagram layouts.
   - **Export Capabilities:** Export to high-resolution PNG, SVG, or JSON representations.

4. Technical Plan (How)
- **Frontend:** React + Zustand (State Management) + React Flow / HTML5 Canvas + MUI (Material-UI)
- **Other tools/libraries:** Vite, Tailwind CSS, Zod (Schema Validation), Firebase/Supabase (for Auth/DB stretch goals).
- **GitHub Repo Link:** [Insert URL]
- **Deployment Plan:** Vercel

5. Team Roles & Responsibilities
- **[Name 1]** — **[Role: Frontend Architecture & Canvas Interactions (Coding / Design)]**
- **[Name 2]** — **[Role: State Management & Component Library (Coding / Testing)]**
- **[Name 3]** — **[Role: Tooling, User Controls & QA (Coding / Testing)]**
- **[Name 4]** — **[Role: Routing, Documentation & Deployment (Docs / DevOps)]**
*(Collaboration: We will use GitHub for version control with a feature-branch workflow. Communication & coordination will happen via Discord and weekly Zoom syncs. Jira/Trello will be used for Kanban task tracking.)*

6. Risks & Mitigation
- **Risk 1:** Rendering performance bottlenecks when handling hundreds of nodes/edges on the Canvas. → **Mitigation plan:** Implement canvas virtualization for off-screen items, utilize debounced state updates, and apply strategic React memoization to prevent unnecessary re-renders.
- **Risk 2:** Managing complex state synchronization across multi-tab workspaces along with undo/redo history. → **Mitigation plan:** Employ a robust centralized state management solution (Zustand) with strict action dispatch rules, backed by comprehensive unit tests for core state reducers.

7. Metrics of Success
- **Accessibility:** Achieve a 90+ Lighthouse Accessibility score; ensure proper keyboard navigability for critical canvas actions (WCAG compliant).
- **Performance:** Maintain a smooth 60 FPS during canvas panning/zooming; achieve High Core Web Vitals (LCP < 2.5s) and a 90+ Lighthouse Performance score.
- **Usability:** Achieve positive testing feedback and >80% task completion rates from 2–3 software architecture student test users when asked to reproduce a target backend diagram.
- **Other metrics:** Zero unhandled console errors during standard end-to-end user flows.

8. References (Optional)
- Excalidraw (for UX design elements)
- React Flow (for component and graph foundations)
- Draw.io (for orthogonal routing paradigms)
