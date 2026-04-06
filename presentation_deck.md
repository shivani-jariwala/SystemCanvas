````carousel
# SystemCanvas
**System DEsign tool**

### Final Project Presentation
*Design digital system architectures at the speed of thought.*

**The Team:**
1. **[Member 1 Name]** 
2. **[Member 2 Name]** 
3. **[Member 3 Name]** 
4. **[Member 4 Name]** 

<!-- slide -->
# Agenda
### Presentation Contents

1. **Introduction & Architecture** (Problem Statement, SPA Tech Stack, Zustand Data Flow)
2. **The Intelligent UI Engine** (Generic Node Factory, Context Menus, Keyboard Shortcuts)
3. **Advanced Mechanics** (Multi-Tab Workspaces, VPC Grouping, Auto-Alignment, Undo/Redo)
4. **Market Differentiation & Future Scope** (Developer-First Focus, Customizable Stickers, AI Roadmap)

<!-- slide -->
# MEMBER 1 
### Introduction & Problem Statement

**The Problem:**
Traditional diagramming tools like Visio or Draw.io are clunky, slow, and aesthetically outdated. Developers spend hours wrestling with layout alignment rather than designing the actual system architecture.

**The Solution:**
SystemCanvas is a premium workspace built exclusively for software architects. We provide a speed-oriented, visually stunning canvas that generates presentation-ready graphics instantly.

<!-- slide -->
# MEMBER 1 
### System Architecture & Tech Stack

Our application operates entirely in the browser, leveraging a React-driven Single Page Application (SPA) architecture to ensure zero latency.

*   **View Layer:** React 18 handles the complex UI component tree.
*   **Canvas Engine:** `@xyflow/react` powers the underlying WebGL node graph and mathematical viewport rendering.
*   **Styling & UI:** Tailwind CSS for the dark-mode grid and Framer-Motion for fluid page transitions.
*   **Routing:** React Router DOM manages protected URL boundaries.

<!-- slide -->
# MEMBER 1 
### State & Data Flow Architecture

SystemCanvas rejects native React Context in favor of **Zustand**, a lightweight global state manager. 

*   **The Store (`useCanvasStore`):** A centralized nervous system housing the `nodes`, `edges`, and `history` arrays.
*   **Data Bound Components:** Nodes and UI toolbars subscribe individually to specific Zustand selectors, preventing the 60fps canvas from causing aggressive, application-wide React re-renders.
*   **Persistence:** The store automatically serializes complex JS node objects into JSON strings stored in `localStorage`.

<!-- slide -->
# MEMBER 2 
### Feature 1: Intelligent Component Library

SystemCanvas comes pre-loaded with an extensive library of architectural primitives categorized by logical function.

*   **Functional Segregation:** Components are strictly separated into *Network & Edge*, *Compute*, *Data*, and *AI*.
*   **The Node Factory:** We built a dynamic `GenericSystemNode` factory that mathematically renders custom shapes, injecting specific `Lucide-React` icons (like AI Bots or CDNs) without code bloat.
*   **Live Indicators:** Nodes feature dynamic "Healthy/Active" pulsing indicator dots simulating live environments.

<!-- slide -->
# MEMBER 2 
### Demo: Workspace & Component Palette

*Here is the complex, nested sidebar logic beside the WebGL canvas grid.*

![Canvas UI and Architecture](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774564762797.png)

<!-- slide -->
# MEMBER 2 
### Feature 2: Context Menus & Shortcuts

We engineered SystemCanvas to be driven by power-users without reaching for the mouse menus.

*   **Context Menus:** We intercepted default browser behavior to render a custom React Node Action menu directly onto `(x,y)` canvas coordinates.
*   **Z-Index Logic:** Users can push nodes behind or pull them in front of others.
*   **Keyboard Engine:** A global listener mapped to `⌘D` (Duplicate Selected), `⌘A` (Select All), and native `Backspace` node deletion speeds up workflows.
*   **Context Menu Demo:**
    ![Context Menu Demo](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774563340287.png)

<!-- slide -->
# MEMBER 3 
### Feature 3: Multi-Tab & Time Travel

Enterprise architectures are too complex to fit on a single screen. We built an isolated multi-page engine within the same project.

*   **Hot-Swapping Logic:** The Tab Bar triggers Zustand to safely cache current `edges` and `nodes` into a master array, wiping the canvas blank, and injecting a new tab's history data instantly.
*   **Time Travel Engine:** A custom History Stack manages deep-cloned snapshots of `pastStates` and `futureStates`. Every mutation triggers a snapshot, allowing infinite Ctrl+Z reversals.

<!-- slide -->
# MEMBER 3 
### Feature 4: Semantic VPC Groupings 

Architectures require structural boundaries (like AWS VPCs or Subnets). 

*   **Bounding Boxes:** Users can drag a `Group / VPC` block onto the canvas. 
*   **Intersection Algorithms:** We execute collision detection (`getIntersectingNodes`) when a drag event stops. If a standard node is dropped *inside* a Group, it is mathematically parented.
*   **Auto-Alignment Tools:** Selecting multiple nodes exposes a floating Alignment Toolbar for pixel-perfect structural distribution (Left, Center, Top).

<!-- slide -->
# MEMBER 3 
### Demo: Workspace Organization

*A demonstration of the VPC Group bounding boxes capturing child Microservices alongside alignment tools.*

![Context Menu Demo](/Users/piyushdeshmukh/.gemini/antigravity/brain/11aa1a6a-a6e6-4d8a-b0fd-67bc30e8b057/.system_generated/click_feedback/click_feedback_1774563340287.png)

<!-- slide -->
# MEMBER 4 
### The Developer-Oriented Ecosystem

Unlike traditional generic drawing tools, SystemCanvas is engineered natively and specifically for software engineers.

*   **Logic-Based Primitives:** We don't just provide generic unformatted boxes. Every component in our palette—from LLM Engines to Load Balancers—carries distinct architectural weight.
*   **Keyboard Speed:** Developers fly through creation with aggressively mapped `⌘` keyboard shortcuts (`⌘D`, `⌘A`) rather than hunting through buried dropdown menus.
*   **Customizable Annotations:** You can customize and stamp your own architecture stickers, sticky notes, and text blocks instantly to leave granular developer notes without inflating the diagram.

<!-- slide -->
# MEMBER 4 
### Market Differentiation
*How is SystemCanvas different from Figma or Draw.io?*

1.  **Vs. Figma:** Figma is a brilliant, sprawling layout tool built for *artists* and *designers*. Creating rapid cloud architecture diagrams requires building components manually from scratch. SystemCanvas strips away decorative bloat to offer pure, professional engineering building blocks instantly.
2.  **Vs. Draw.io / Lucidchart:** These tools are universally generic and aesthetically dated. SystemCanvas, however, forces strict Orthogonal layouts, auto-alignment Math capabilities, and nested VPC intersection boundaries out of the box. It is highly developer-oriented—nothing else.

<!-- slide -->
# MEMBER 4 
### Future Work & Roadmap

In the next iteration of SystemCanvas, we aim to implement:

*   **Multi-user Real-time Collaboration:** Integrate WebSockets (Socket.io) for live cursor tracking and operational conflict resolution.
*   **Intelligent Templates:** Inject predefined starting points for standard industry architectures (Serverless loops, etc.).
*   **AI Text-to-Graph Generation:** Allow architects to feed an LLM a prompt (e.g., "Design a 3000 RPS Node server on AWS"), which will automatically map nodes onto the canvas in seconds.

<!-- slide -->
# Thank You!

**SystemCanvas is Live.**  
The complete source code and documentation can be run locally via `npm run dev`.

### Questions & Answers
We'd be happy to discuss the architecture, challenges encountered with React Flow, or the Zustand state engineering!
````
