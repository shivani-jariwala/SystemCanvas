# SystemCanvas

## Introduction
SystemCanvas is a professional, React-based web application designed to help developers and architects design digital system architectures at the speed of thought. Built with Vite, React Flow, and Tailwind CSS, it provides a premium, canvas-driven experience akin to Figma and draw.io, but specifically tailored for software architecture diagrams.

## Current Functionalities
- **Real Registration Flow**: A fully functional client-side authentication flow using localStorage for instant account creation and secure sessions.
- **Multi-Tab Workspaces**: Organize complex infrastructure designs across multiple isolated "Page" tabs within the same project.
- **Component Palette**: A vast library of node components neatly categorized into logical segments:
  - Network & Edge (User, DNS, CDN, API Gateway, Load Balancers)
  - Compute & Data (Microservices, Databases, Caches, Message Queues)
  - AI & Machine Learning (Models, Vector DBs, LLMs)
  - Cloud Providers (AWS, Google Cloud, Azure, Kubernetes)
- **Advanced Edge Routing**: Toggle between silky Bezier curves and strict Orthogonal (right-angle) lines for professional routing.
- **Semantic Grouping & VPCs**: Interactive bounding boxes. Drag and drop any components inside a Group/VPC; they will automatically bind and move with their parent container.
- **Context Menus & Z-Index**: Right-click any component to duplicate it, delete it, or send it forwards/backwards in the visual stack.
- **Alignment & Distribution Mechanics**: Multi-select nodes (Shift + drag) to access an advanced Alignment Toolbar for pixel-perfect structural distribution (Left, Center, Right, etc.).
- **Keyboard Shortcuts Engine**: professional-grade keystrokes (`⌘D` Duplicate, `⌘A` Select All, `Backspace` Delete) for rapid prototyping.
- **High-Quality Export**: Export entire architectures cleanly as PNGs or SVGs with a single click.
- **Local Persistence**: Designs save to `localStorage` securely so you never lose your architecture.

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository and navigate into the `SystemCanvas` directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.
5. *Demo Note*: Use the interactive Sign-Up form on the login screen, or log in securely.

## Deploying to Vercel

This app is a static Vite build (`npm run build` outputs to `dist`). A `vercel.json` in the repo sets the output directory and SPA fallback so client-side routes always serve `index.html`.

### Option A — Import from GitHub (recommended)

1. Push this repository to GitHub (if it is not already).
2. Go to [vercel.com](https://vercel.com), sign in, and click **Add New Project**.
3. Import the **SystemCanvas** repository. Vercel usually detects Vite automatically; if not, set **Framework Preset** to **Vite** or **Other** with:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install` (or leave default)
4. Deploy. Every push to your production branch will trigger a new deployment.

### Option B — Vercel CLI

From the project root (requires a [Vercel account](https://vercel.com/signup) and the CLI logged in):

```bash
npm i -g vercel
vercel
```

Follow the prompts to link the folder to a Vercel project. For a production URL:

```bash
vercel --prod
```

The first time you run `vercel`, your browser will open for authentication.

## Future Roadmap
- **Multi-user Real-time Collaboration**: WebSocket integration for live presence, cursors, and conflict resolution alongside your team.
- **Intelligent Templates**: Pre-built starting points for standard architectures like Event-Driven Serverless or 3-Tier Web Apps.
- **AI Integration**: Text-to-diagram generation, allowing you to prompt architectures into existence.
- **Image Upload Support**: Import screenshots and external reference diagrams straight onto the canvas workspace.
