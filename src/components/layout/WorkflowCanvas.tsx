import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition
} from "reactflow";
import { WorkflowNodeCard } from "../nodes/WorkflowNodeCard";
import type { NodeKind, WorkflowEdge, WorkflowNode } from "../../types/workflow";

type WorkflowCanvasProps = {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeSelect: (nodeId: string | null) => void;
  onDropNode: (type: NodeKind, position: XYPosition) => void;
};

const nodeTypes = {
  start: WorkflowNodeCard,
  task: WorkflowNodeCard,
  approval: WorkflowNodeCard,
  automation: WorkflowNodeCard,
  end: WorkflowNodeCard
};

export const WorkflowCanvas = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
  onDropNode
}: WorkflowCanvasProps) => {
  const { screenToFlowPosition } = useReactFlow();

  return (
    <section className="canvas-shell">
      <div className="canvas-header">
        <div>
          <h1>HR Workflow Designer</h1>
          <p>Build onboarding, leave approval, and document workflows in a small sandbox.</p>
        </div>
      </div>

      <div className="canvas-panel">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onPaneClick={() => onNodeSelect(null)}
          onNodeClick={(_, node) => onNodeSelect(node.id)}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }}
          onDrop={(event) => {
            event.preventDefault();
            const type = event.dataTransfer.getData("application/reactflow") as NodeKind;
            if (!type) {
              return;
            }
            onDropNode(type, screenToFlowPosition({ x: event.clientX, y: event.clientY }));
          }}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
          defaultEdgeOptions={{
            animated: false,
            style: { strokeWidth: 2, stroke: "#756452" }
          }}
        >
          <MiniMap pannable zoomable />
          <Controls />
          <Background color="#d6c7b5" gap={24} />
        </ReactFlow>
      </div>
    </section>
  );
};
