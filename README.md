# SystemCanvas

SystemCanvas is a powerful, web-based system architecture diagramming tool built with **React**, **Vite**, **@xyflow/react** (React Flow), **Zustand**, and **Tailwind CSS v4**.

It provides an intuitive, drag-and-drop interface for designing cloud infrastructure, microservices architectures, and flowcharts directly in your browser.

![SystemCanvas Screenshot](systemcanvas-preview.png)

## Features

### 🚀 Core Functionality
- **Drag-and-Drop Workspace**: Endless canvas powered by React Flow.
- **Categorized Node Library**: 30+ components across categories like Components, Annotations, Shapes, and major cloud providers.
- **Animated Connections**: Smoothstep edges with animated directional flow.
- **Node Inspector**: Edit labels, statuses (Healthy, Degraded, Down), and simulated latencies.

### 💼 Premium Tools
- **Export to Image**: Instantly download your architecture as a PNG or SVG.
- **Save & Load**: Automatically persists your diagrams to `localStorage` so you never lose your work.
- **Undo / Redo History**: Confidently make changes with full action history.
- **MiniMap & Fit-to-View**: Easily navigate complex, large-scale system diagrams.
- **Floating Toolbar**: Quick access to all core actions right on the canvas.

### ☁️ Cloud Libraries
- **AWS**: EC2, S3, Lambda, RDS, SQS, SNS
- **Google Cloud**: Compute Engine, Cloud Storage, Cloud Functions, BigQuery, Pub/Sub
- **Azure**: Virtual Machine, Blob Storage, Functions, SQL Database, Service Bus
- **Kubernetes**: Pod, Service, Deployment, Ingress, ConfigMap

### 📝 Annotations & Shapes
- **Sticky Notes**: Color-coded, resizable notes with fold effects.
- **Shapes**: Rectangles, circles, and diamonds for standard flowcharting.
- **Text & Tables**: Rich text blocks and editable key-value tables.

---

## Tech Stack
- **Frontend Framework**: React 19 + Vite
- **Diagramming Engine**: @xyflow/react
- **State Management**: Zustand
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Export**: html-to-image

---

## Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`.

---

## Future Roadmap
- Multi-user real-time collaboration with conflict resolution.
- Intelligent template suggestions (e.g., standard 3-tier web app, event-driven microservices).
- AI Integration for text-to-diagram generation and component suggestions.
- Image upload support to use existing diagrams as reference backgrounds.
