````carousel
# SystemCanvas
**Cloud Architecture Visualizer**

### Final Project Presentation
*Design digital system architectures at the speed of thought.*

**The Team:**
1. **[Member 1 Name]** - UI/UX & Layout Engineer
2. **[Member 2 Name]** - Canvas & Custom Nodes Lead
3. **[Member 3 Name]** - State Management & Data Engineer
4. **[Member 4 Name]** - Authentication & Routing Lead

<!-- slide -->
# MEMBER 1: UI/UX & Layout Engineer
### The Vision & Design System

**Objective:**
Shift away from clunky, outdated enterprise diagramming tools by building a premium, developer-focused interface inspired by Figma.

**Key Contributions:**
*   Architected the global dark-mode design system using **Tailwind CSS**.
*   Integrated **Lucide-React** for crisp, scalable SVG iconography.
*   Built the responsive Flexbox grid that houses the Sidebar, Canvas Workspace, and Inspector properties panel.

<!-- slide -->
# MEMBER 1: UI/UX & Layout Engineer
### The intelligent Component Palette

**Objective:**
Make finding and dragging 30+ cloud components instantaneous.

**Key Contributions:**
*   Built the **Collapsible Sidebar**, strictly categorizing components by logic tiers: Network, Compute, Data, AI, and Cloud Providers.
*   Implemented a real-time **live search algorithm** that filters components dynamically as the user types.
*   Wired the HTML5 Drag-and-Drop (`dataTransfer`) protocol to allow nodes to be seamlessly dragged from the DOM into the WebGL/Canvas context.

<!-- slide -->
# MEMBER 1: UI/UX & Layout Engineer
### Floating Toolbars & User Interactions

**Objective:**
Provide power-user features without cluttering the screen.

**Key Contributions:**
*   Designed the absolute-positioned **Main Toolbar** for zooming, reverting history, and toggling edge-routing modes (Orthogonal vs Bezier curves).
*   Built the dynamic **Alignment Toolbar** which only appears conditionally when multiple nodes are selected.
*   Implemented Toast notifications for system feedback (e.g., successful local saves, export failures).

<!-- slide -->
# MEMBER 1: UI/UX & Layout Engineer
### Working Demo: The UI Layout

*Here is the final layout showing the complex, nested sidebar logic beside the WebGL canvas grid.*

![Canvas UI and Architecture](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774564762797.png)

<!-- slide -->
# MEMBER 2: Canvas & Custom Nodes Lead
### React Flow Engine Integration

**Objective:**
Power the core diagramming canvas with a mathematically sound, interactive node graph.

**Key Contributions:**
*   Configured `@xyflow/react` to act as the primary engine for the center canvas.
*   Set up the `MiniMap`, `Controls`, and `Background` grid configurations.
*   Engineered the mathematical coordinate mapping (`screenToFlowPosition`) to accurately translate dropped sidebar items into precise canvas coordinates based on the user's current zoom and pan.

<!-- slide -->
# MEMBER 2: Canvas & Custom Nodes Lead
### The Generic System Node Factory

**Objective:**
Support dozens of varying node types without writing duplicated boilerplate React code.

**Key Contributions:**
*   Programmed the `GenericSystemNode` factory component.
*   This single function dynamically outputs User, DNS, CDN, AI Model, and Vector DB components by injecting specific configurations and icons on the fly.
*   Added dynamic "Healthy/Active" pulsing indicator dots inside the custom nodes based on live property injection.

<!-- slide -->
# MEMBER 2: Canvas & Custom Nodes Lead
### Context Menus & Keyboard Engine

**Objective:**
Provide rapid, professional-grade tools for mutating diagrams.

**Key Contributions:**
*   Overrode default browser behaviors to render a custom **Context Menu** component directly onto the canvas absolute `(x,y)` coordinates.
*   Engineered Z-Index manipulation logic (`Bring to Front` / `Send to Back`).
*   Developed a global `useEffect` Keyboard Engine listener for `⌘D` (Duplicate Selected), `⌘A` (Select All), and native node deletion.

<!-- slide -->
# MEMBER 2: Canvas & Custom Nodes Lead
### Working Demo: Semantic Grouping & Menus

*A demonstration of the VPC Group bounding boxes capturing child Microservices, alongside the custom Context Menu.*

![Context Menu Demo](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774563340287.png)

<!-- slide -->
# MEMBER 3: State Management & Data Eng
### Architecting Zustand

**Objective:**
Manage large arrays of complex graph state without triggering aggressive React re-renders.

**Key Contributions:**
*   Replaced native React Context with **Zustand** for lightweight, boilerplate-free state logic.
*   Built the `useCanvasStore.js` controlling the master `nodes`, `edges`, and `selectedNodeId` states.
*   Wrote the complex logic arrays for the auto-alignment tools (Left, Center, Right distribution) computing bounding boxes computationally.

<!-- slide -->
# MEMBER 3: State Management & Data Eng
### Multi-Page Workspace Implementation

**Objective:**
Allow users to create sprawling, isolated architectures within a single project file.

**Key Contributions:**
*   Engineered the **TabBar** concept.
*   Developed a hot-swapping algorithm in `useCanvasStore` that saves the active nodes & edges into a `pages` array, then extracts the target page's history into the core workspace instantly.
*   Supported inline tab renaming and tab deletion safely.

<!-- slide -->
# MEMBER 3: State Management & Data Eng
### Time Travel: Undo & Redo History

**Objective:**
Prevent catastrophic data loss during diagramming.

**Key Contributions:**
*   Built a custom **History Stack** managing deep-cloned snapshots of `pastStates` and `futureStates`.
*   Hooked the history stack up to every mutation action (adding nodes, moving edges, changing data).
*   Ensured history stacks are strictly capped at 50 snapshots to prevent browser memory leaks.

<!-- slide -->
# MEMBER 3: State Management & Data Eng
### Persistence & Image Exporting

**Objective:**
Keep diagrams alive across browser refreshing and allow users to export their work.

**Key Contributions:**
*   Wrote the `localStorage` serializer saving the unified Multi-Tab document JSON payload.
*   Wrote the backward compatibility deserializer to ensure older app versions don't crash when loading the new tab arrays.
*   Integrated `html-to-image` parsing the WebGL DOM to spit out high-res PNG and SVG files securely.

<!-- slide -->
# MEMBER 4: Authentication & Routing Lead
### Security First Philosophy

**Objective:**
Ensure user data is distinct, secure, and gate-kept behind modern authentication flows.

**Key Contributions:**
*   Designed the overarching protected client-side layout.
*   If a user is not authenticated, the `App.jsx` router cleanly blocks the workspace and mounts the full-screen interactive Login layer.
*   Designed a mock backend logic simulating database JWT tokens directly via `localStorage`.

<!-- slide -->
# MEMBER 4: Authentication & Routing Lead
### The Animated Login Interface

**Objective:**
Create an arresting, premium first impression for the software.

**Key Contributions:**
*   Styled the `LoginPage.jsx` layout using flex-panels and blurred CSS gradient orbs.
*   Integrated **Framer Motion** for silky smooth cross-fade animations when swapping between views or revealing error banners.
*   Injected a dynamic loading state with a simulated `setTimeout` latency to simulate API calls.

<!-- slide -->
# MEMBER 4: Authentication & Routing Lead
### User Registry & Validation Logic

**Objective:**
Execute actual credential hashing and logical verification.

**Key Contributions:**
*   Engineered the local Sign-Up form logic.
*   Wrote the validation loops parsing for missing fields, minimum password length rules, and exact matching "Confirm Password" statements.
*   Wrote the duplication check that iterates through the simulated `systemcanvas-users` database to block duplicate username registrations.

<!-- slide -->
# MEMBER 4: Authentication & Routing Lead
### Working Demo: Secure Sign Up

*The animated authentication flow securing the primary workspace.*

![Login Form Image](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774563283864.png)

<!-- slide -->
# Future Roadmap

In the next iteration of SystemCanvas, we aim to implement:

*   **Multi-user Real-time Collaboration:** Integrate WebSockets (Socket.io) for live cursor tracking and operational conflict resolution.
*   **Intelligent Templates:** Inject predefined starting points for standard industry architectures (Serverless loops, etc.).
*   **AI Integration:** Text-to-diagram generation, allowing architects to prompt complete environments instantly.
*   **Custom Cloud APIs:** Linking directly into AWS/GCP to map out actual live billings based on the diagrams.

<!-- slide -->
# Thank You!

**SystemCanvas is Live.**  
The complete source code and documentation can be run locally via `npm run dev`.

### Questions & Answers
We'd be happy to discuss the architecture, challenges encountered with React Flow, or the Zustand state engineering!
````
