import { ReactFlowProvider } from "reactflow";
import { NodeFormPanel } from "./components/layout/NodeFormPanel";
import { SandboxPanel } from "./components/layout/SandboxPanel";
import { Sidebar } from "./components/layout/Sidebar";
import { WorkflowCanvas } from "./components/layout/WorkflowCanvas";
import { useWorkflowDesigner } from "./hooks/useWorkflowDesigner";

const App = () => {
  const {
    nodes,
    edges,
    selectedNode,
    automations,
    simulationResult,
    isRunningSimulation,
    serializedGraph,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    updateNodeData,
    runSimulation,
    setSelectedNodeId
  } = useWorkflowDesigner();

  return (
    <ReactFlowProvider>
      <div className="app-shell">
        <div className="workspace-grid">
          <Sidebar onAddNode={addNode} />
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeSelect={setSelectedNodeId}
            onDropNode={addNode}
          />
          <NodeFormPanel
            node={selectedNode}
            automations={automations}
            onChange={updateNodeData}
          />
        </div>

        <SandboxPanel
          result={simulationResult}
          serializedGraph={serializedGraph}
          isRunning={isRunningSimulation}
          onRun={runSimulation}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
