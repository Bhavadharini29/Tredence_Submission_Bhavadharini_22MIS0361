import { useEffect, useMemo, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition
} from "reactflow";
import { getAutomations, simulateWorkflow } from "../api/mockApi";
import { createDefaultNodeData } from "../data/nodeCatalog";
import { serializeWorkflow } from "../utils/workflowSerialization";
import type {
  AutomationDefinition,
  NodeKind,
  SimulationResponse,
  WorkflowEdge,
  WorkflowNode
} from "../types/workflow";

const initialNodes: WorkflowNode[] = [
  {
    id: "start-1",
    type: "start",
    position: { x: 120, y: 80 },
    data: createDefaultNodeData("start")
  },
  {
    id: "task-1",
    type: "task",
    position: { x: 120, y: 240 },
    data: createDefaultNodeData("task")
  },
  {
    id: "end-1",
    type: "end",
    position: { x: 120, y: 420 },
    data: createDefaultNodeData("end")
  }
];

const initialEdges: WorkflowEdge[] = [
  { id: "edge-start-task", source: "start-1", target: "task-1" },
  { id: "edge-task-end", source: "task-1", target: "end-1" }
];

export const useWorkflowDesigner = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes);
  const [edges, setEdges] = useState<WorkflowEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [automations, setAutomations] = useState<AutomationDefinition[]>([]);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);

  useEffect(() => {
    getAutomations().then(setAutomations);
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const serializedGraph = useMemo(
    () => JSON.stringify(serializeWorkflow(nodes, edges), null, 2),
    [nodes, edges]
  );

  const buildNode = (type: NodeKind, position?: XYPosition): WorkflowNode => {
    const count = nodes.filter((node) => node.data.type === type).length + 1;
    return {
      id: `${type}-${count}`,
      type,
      position: position ?? {
        x: 280 + (count % 2) * 160,
        y: 80 + count * 110
      },
      data: createDefaultNodeData(type)
    };
  };

  const addNode = (type: NodeKind, position?: XYPosition) => {
    const nextNode = buildNode(type, position);
    setNodes((current) => [...current, nextNode]);
    setSelectedNodeId(nextNode.id);
  };

  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((current) => applyNodeChanges(changes, current));
    const removed = changes.find((change) => change.type === "remove");
    if (removed && removed.id === selectedNodeId) {
      setSelectedNodeId(null);
    }
  };

  const onEdgesChange = (changes: EdgeChange[]) => {
    setEdges((current) => applyEdgeChanges(changes, current));
  };

  const onConnect = (connection: Connection) => {
    setEdges((current) =>
      addEdge(
        {
          ...connection,
          id: `${connection.source}-${connection.target}-${current.length + 1}`
        },
        current
      )
    );
  };

  const updateNodeData = (
    nodeId: string,
    updater: (current: WorkflowNode["data"]) => WorkflowNode["data"]
  ) => {
    setNodes((current) =>
      current.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: updater(node.data)
            }
          : node
      )
    );
  };

  const runSimulation = async () => {
    setIsRunningSimulation(true);
    try {
      const result = await simulateWorkflow(nodes, edges);
      setSimulationResult(result);
    } finally {
      setIsRunningSimulation(false);
    }
  };

  return {
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
  };
};
