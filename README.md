# HR Workflow Designer

A small React and React Flow prototype, The app lets an HR admin create a workflow visually, edit node configurations, and simulate the workflow through a mock API layer.

## What is included

- React application built with Vite 
- React Flow canvas with custom node cards and sidebar drag-and-drop
- Editable forms for Start, Task, Approval, Automated Step, and End nodes
- Local mock API for `GET /automations` and `POST /simulate`
- Sandbox panel that serializes the graph and shows a step-by-step execution log
- Basic workflow validation for disconnected nodes, bad Start node placement, and cycles

## Project structure

```text
src/
  api/           mock API layer
  components/    canvas, panels, and custom node UI
  data/          node metadata and default factories
  hooks/         workflow state management
  types/         TypeScript models
  utils/         validation and serialization helpers
```

## Run project

```bash
npm install
npm run dev
```

To create a production build:

```bash
npm run build
```

## Design choices

- The app keeps workflow state in a single custom hook so canvas interactions, node editing, and simulation stay coordinated.
- Each node type shares one visual card component but keeps separate form logic, which makes it easier to add future node types.
- The mock API is intentionally local and async so the code path looks realistic without needing a backend.
- Styling is intentionally simple and warm rather than heavily polished, matching the requirement to focus on clarity and working functionality.

## Assumptions

- Sidebar items support drag-and-drop into the canvas, and click-to-add is kept as a fallback for convenience.
- Workflow validation is basic but covers the core cases called out in the brief.
- Export/import and undo/redo were left out to keep the implementation focused and readable.
